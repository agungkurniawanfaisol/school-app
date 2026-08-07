<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_releases', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('version', 20);
            $table->string('title', 150);
            $table->text('body');
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->unique('version');
            $table->index(['is_published', 'published_at'], 'app_releases_published_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_releases');
    }
};
