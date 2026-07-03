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
        Schema::table('teachers', function (Blueprint $table): void {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        foreach (DB::table('teachers')->whereNull('uuid')->cursor() as $row) {
            DB::table('teachers')->where('id', $row->id)->update(['uuid' => (string) Str::uuid()]);
        }
    }

    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table): void {
            $table->dropColumn('uuid');
        });
    }
};
