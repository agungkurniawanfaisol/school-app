<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pmb_registration_messages', function (Blueprint $table) {
            $table->timestamp('read_at')->nullable()->after('media_id');
            $table->index(['pmb_registration_id', 'read_at'], 'pmb_msg_reg_read_idx');
        });

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->timestamp('notifications_seen_at')->nullable()->after('loa_media_id');
        });
    }

    public function down(): void
    {
        Schema::table('pmb_registration_messages', function (Blueprint $table) {
            $table->dropIndex('pmb_msg_reg_read_idx');
            $table->dropColumn('read_at');
        });

        Schema::table('pmb_registrations', function (Blueprint $table) {
            $table->dropColumn('notifications_seen_at');
        });
    }
};
