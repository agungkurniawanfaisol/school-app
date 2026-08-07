<?php

use App\Models\School;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pmb_programs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('code', 30);
            $table->string('name', 100);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['school_id', 'code'], 'pmb_programs_school_code_unique');
            $table->index(['school_id', 'is_active', 'sort_order'], 'pmb_programs_school_active_sort_idx');
        });

        $defaults = [
            ['code' => 'reguler', 'name' => 'Reguler', 'sort_order' => 10],
            ['code' => 'icp', 'name' => 'ICP', 'sort_order' => 20],
        ];

        $schoolIds = School::query()->pluck('id');
        if ($schoolIds->isEmpty()) {
            $schoolIds = DB::table('pmb_fees')->distinct()->pluck('school_id');
        }

        $now = now();
        foreach ($schoolIds as $schoolId) {
            foreach ($defaults as $row) {
                DB::table('pmb_programs')->insert([
                    'uuid' => (string) Str::uuid(),
                    'school_id' => $schoolId,
                    'code' => $row['code'],
                    'name' => $row['name'],
                    'sort_order' => $row['sort_order'],
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        $extra = DB::table('pmb_fees')
            ->select('school_id', 'program')
            ->whereNotNull('program')
            ->distinct()
            ->get();

        foreach ($extra as $row) {
            $exists = DB::table('pmb_programs')
                ->where('school_id', $row->school_id)
                ->where('code', $row->program)
                ->exists();
            if ($exists) {
                continue;
            }
            DB::table('pmb_programs')->insert([
                'uuid' => (string) Str::uuid(),
                'school_id' => $row->school_id,
                'code' => $row->program,
                'name' => strtoupper((string) $row->program),
                'sort_order' => 100,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->foreignId('pmb_program_id')
                ->nullable()
                ->after('jenjang')
                ->constrained('pmb_programs')
                ->restrictOnDelete();
        });

        $programs = DB::table('pmb_programs')->get(['id', 'school_id', 'code']);
        foreach ($programs as $program) {
            DB::table('pmb_fees')
                ->where('school_id', $program->school_id)
                ->where('program', $program->code)
                ->whereNull('pmb_program_id')
                ->update(['pmb_program_id' => $program->id]);
        }

        // Orphan fees without matching program — attach/create reguler fallback
        $orphans = DB::table('pmb_fees')->whereNull('pmb_program_id')->get(['id', 'school_id', 'program']);
        foreach ($orphans as $fee) {
            $programId = DB::table('pmb_programs')
                ->where('school_id', $fee->school_id)
                ->where('code', $fee->program ?: 'reguler')
                ->value('id');
            if (! $programId) {
                $programId = DB::table('pmb_programs')->insertGetId([
                    'uuid' => (string) Str::uuid(),
                    'school_id' => $fee->school_id,
                    'code' => $fee->program ?: 'reguler',
                    'name' => strtoupper((string) ($fee->program ?: 'reguler')),
                    'sort_order' => 100,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
            DB::table('pmb_fees')->where('id', $fee->id)->update(['pmb_program_id' => $programId]);
        }

        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->dropUnique('pmb_fees_school_year_jenjang_program_unique');
        });

        // App always requires pmb_program_id; keep nullable at DB for SQLite test migrations.
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE pmb_fees MODIFY pmb_program_id BIGINT UNSIGNED NOT NULL');
        }

        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->unique(
                ['school_id', 'academic_year_id', 'jenjang', 'pmb_program_id'],
                'pmb_fees_school_year_jenjang_program_id_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->dropUnique('pmb_fees_school_year_jenjang_program_id_unique');
        });

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE pmb_fees MODIFY pmb_program_id BIGINT UNSIGNED NULL');
        }

        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->dropConstrainedForeignId('pmb_program_id');
            $table->unique(
                ['school_id', 'academic_year_id', 'jenjang', 'program'],
                'pmb_fees_school_year_jenjang_program_unique'
            );
        });

        Schema::dropIfExists('pmb_programs');
    }
};
