<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->string('academic_year', 20)->nullable()->after('grade_applied')->index();
            $table->index(['school_id', 'academic_year', 'status'], 'pmb_school_year_status_idx');
        });

        DB::table('pmb_registrations')
            ->whereNull('academic_year')
            ->orderBy('id')
            ->chunkById(100, function ($rows): void {
                foreach ($rows as $row) {
                    $payload = json_decode((string) ($row->draft_payload ?? ''), true);
                    $year = is_array($payload) ? ($payload['academic_year'] ?? null) : null;

                    if (! is_string($year) || $year === '') {
                        $createdAt = $row->created_at ? strtotime((string) $row->created_at) : time();
                        $month = (int) date('n', $createdAt);
                        $yearNum = (int) date('Y', $createdAt);
                        $startYear = $month >= 7 ? $yearNum : $yearNum - 1;
                        $year = "{$startYear}/".($startYear + 1);
                    }

                    DB::table('pmb_registrations')
                        ->where('id', $row->id)
                        ->update(['academic_year' => $year]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->dropIndex('pmb_school_year_status_idx');
            $table->dropColumn('academic_year');
        });
    }
};
