<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->string('name', 100)->default('SD Reguler')->after('academic_year_id');
            $table->string('jenjang', 10)->default('sd')->after('name');
            $table->string('program', 20)->default('reguler')->after('jenjang');
            $table->string('bank_name', 100)->nullable()->after('amount');
            $table->string('account_number', 50)->nullable()->after('bank_name');
            $table->string('account_holder', 150)->nullable()->after('account_number');
        });

        DB::table('pmb_fees')->update([
            'name' => 'SD Reguler',
            'jenjang' => 'sd',
            'program' => 'reguler',
        ]);

        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->dropUnique('pmb_fees_school_year_unique');
            $table->unique(
                ['school_id', 'academic_year_id', 'jenjang', 'program'],
                'pmb_fees_school_year_jenjang_program_unique'
            );
            $table->index(['school_id', 'is_active', 'jenjang'], 'pmb_fees_school_active_jenjang_idx');
        });

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->foreignId('pmb_fee_id')
                ->nullable()
                ->after('academic_year')
                ->constrained('pmb_fees')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('pmb_fee_id');
        });

        Schema::table('pmb_fees', function (Blueprint $table) {
            $table->dropIndex('pmb_fees_school_active_jenjang_idx');
            $table->dropUnique('pmb_fees_school_year_jenjang_program_unique');
            $table->unique(['school_id', 'academic_year_id'], 'pmb_fees_school_year_unique');
            $table->dropColumn([
                'name',
                'jenjang',
                'program',
                'bank_name',
                'account_number',
                'account_holder',
            ]);
        });
    }
};
