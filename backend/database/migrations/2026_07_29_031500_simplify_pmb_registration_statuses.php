<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Simplify PMB statuses:
     * draft | awaiting_verification | needs_revision | accepted | rejected
     */
    public function up(): void
    {
        // Widen if needed (MySQL); ignore on sqlite test DBs that already use flexible strings.
        try {
            if (Schema::getConnection()->getDriverName() === 'mysql') {
                DB::statement('ALTER TABLE pmb_registrations MODIFY status VARCHAR(32) NOT NULL DEFAULT \'draft\'');
            }
        } catch (\Throwable) {
            // Column may already be wide enough.
        }

        $map = [
            'awaiting_payment_review' => 'awaiting_verification',
            'submitted' => 'awaiting_verification',
            'review' => 'awaiting_verification',
            'pending' => 'awaiting_verification',
            'paid' => 'awaiting_verification',
        ];

        foreach ($map as $from => $to) {
            DB::table('pmb_registrations')->where('status', $from)->update(['status' => $to]);
        }
    }

    public function down(): void
    {
        DB::table('pmb_registrations')
            ->where('status', 'awaiting_verification')
            ->update(['status' => 'awaiting_payment_review']);

        DB::table('pmb_registrations')
            ->where('status', 'needs_revision')
            ->update(['status' => 'review']);
    }
};
