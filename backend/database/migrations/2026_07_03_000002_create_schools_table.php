<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name', 250);
            $table->string('slug', 270)->unique();
            $table->string('tagline', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('logo', 500)->nullable();
            $table->string('favicon', 500)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('whatsapp', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('map_embed_url', 1000)->nullable();
            $table->string('vision', 1000)->nullable();
            $table->string('mission', 2000)->nullable();
            $table->json('social_media')->nullable();
            $table->json('seo')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'slug'], 'schools_active_slug_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
