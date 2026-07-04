<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_albums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('slug', 250)->unique();
            $table->text('description')->nullable();
            $table->string('cover_image', 500)->nullable();
            $table->date('event_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'photo_albums_school_active_order_idx');
        });

        Schema::create('album_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photo_album_id')->index()->constrained()->cascadeOnDelete();
            $table->string('url', 500);
            $table->string('caption', 300)->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index(['photo_album_id', 'order'], 'album_photos_album_order_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('album_photos');
        Schema::dropIfExists('photo_albums');
    }
};
