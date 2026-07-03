<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table): void {
            $table->longText('content')->nullable()->change();
        });

        Schema::table('student_activities', function (Blueprint $table): void {
            $table->longText('content')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table): void {
            $table->longText('content')->nullable(false)->change();
        });

        Schema::table('student_activities', function (Blueprint $table): void {
            $table->longText('content')->nullable(false)->change();
        });
    }
};
