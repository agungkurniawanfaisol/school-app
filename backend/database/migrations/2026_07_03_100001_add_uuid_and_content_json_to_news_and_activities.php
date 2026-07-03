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
        Schema::table('news', function (Blueprint $table): void {
            $table->uuid('uuid')->nullable()->unique()->after('id');
            $table->longText('content_json')->nullable()->after('content');
        });

        Schema::table('student_activities', function (Blueprint $table): void {
            $table->uuid('uuid')->nullable()->unique()->after('id');
            $table->longText('content_json')->nullable()->after('content');
            $table->string('status', 20)->default('draft')->index()->after('category');
        });

        Schema::table('media', function (Blueprint $table): void {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        foreach (DB::table('news')->whereNull('uuid')->cursor() as $row) {
            DB::table('news')->where('id', $row->id)->update(['uuid' => (string) Str::uuid()]);
        }

        foreach (DB::table('student_activities')->whereNull('uuid')->cursor() as $row) {
            DB::table('student_activities')->where('id', $row->id)->update([
                'uuid' => (string) Str::uuid(),
                'status' => $row->published_at ? 'published' : 'draft',
            ]);
        }

        foreach (DB::table('media')->whereNull('uuid')->cursor() as $row) {
            DB::table('media')->where('id', $row->id)->update(['uuid' => (string) Str::uuid()]);
        }
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table): void {
            $table->dropColumn('uuid');
        });

        Schema::table('student_activities', function (Blueprint $table): void {
            $table->dropColumn(['uuid', 'content_json', 'status']);
        });

        Schema::table('news', function (Blueprint $table): void {
            $table->dropColumn(['uuid', 'content_json']);
        });
    }
};
