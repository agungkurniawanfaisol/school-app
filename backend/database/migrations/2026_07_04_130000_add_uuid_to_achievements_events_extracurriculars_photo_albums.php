<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $tables = ['achievements', 'events', 'extracurriculars', 'photo_albums'];

        foreach ($tables as $tbl) {
            if (!Schema::hasColumn($tbl, 'uuid')) {
                Schema::table($tbl, function (Blueprint $table) {
                    $table->uuid('uuid')->nullable()->unique()->after('id');
                });
            }
            $this->backfillUuids($tbl);
        }
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });

        Schema::table('extracurriculars', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });

        Schema::table('photo_albums', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }

    private function backfillUuids(string $table): void
    {
        $rows = DB::table($table)->whereNull('uuid')->get(['id']);
        foreach ($rows as $row) {
            DB::table($table)->where('id', $row->id)->update(['uuid' => (string) Str::uuid()]);
        }
    }
};
