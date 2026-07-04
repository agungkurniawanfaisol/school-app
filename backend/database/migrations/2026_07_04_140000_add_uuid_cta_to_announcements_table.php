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
        Schema::table('announcements', function (Blueprint $table) {
            $table->uuid('uuid')->unique()->after('id');
            $table->string('cta_text', 100)->nullable()->after('is_active');
            $table->string('cta_url', 500)->nullable()->after('cta_text');
        });

        DB::table('announcements')->whereNull('uuid')->orWhere('uuid', '')->eachById(function ($row) {
            DB::table('announcements')->where('id', $row->id)->update(['uuid' => (string) Str::uuid()]);
        });
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn(['uuid', 'cta_text', 'cta_url']);
        });
    }
};
