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
        Schema::table('facilities', function (Blueprint $table): void {
            $table->uuid('uuid')->nullable()->unique()->after('id');
            $table->longText('content')->nullable()->after('description');
            $table->longText('content_json')->nullable()->after('content');
        });

        foreach (DB::table('facilities')->whereNull('uuid')->cursor() as $row) {
            DB::table('facilities')->where('id', $row->id)->update(['uuid' => (string) Str::uuid()]);
        }
    }

    public function down(): void
    {
        Schema::table('facilities', function (Blueprint $table): void {
            $table->dropColumn(['uuid', 'content', 'content_json']);
        });
    }
};
