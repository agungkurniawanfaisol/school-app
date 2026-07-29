<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->timestamp('admin_notifications_seen_at')->nullable()->after('notifications_seen_at');
        });

        Schema::table('pmb_registration_messages', function (Blueprint $table) {
            $table->timestamp('admin_read_at')->nullable()->after('read_at');
            $table->index(['pmb_registration_id', 'admin_read_at'], 'pmb_msg_reg_admin_read_idx');
        });
    }

    public function down(): void
    {
        Schema::table('pmb_registration_messages', function (Blueprint $table) {
            $table->dropIndex('pmb_msg_reg_admin_read_idx');
            $table->dropColumn('admin_read_at');
        });

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->dropColumn('admin_notifications_seen_at');
        });
    }
};
