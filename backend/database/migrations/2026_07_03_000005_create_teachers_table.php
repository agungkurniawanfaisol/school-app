<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('slug', 270)->unique();
            $table->string('title', 150)->nullable();
            $table->string('subject', 150)->nullable()->index();
            $table->text('bio')->nullable();
            $table->string('photo', 500)->nullable();
            $table->string('email', 150)->nullable();
            $table->json('social_media')->nullable();
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'teachers_school_active_order_idx');
            $table->index(['is_featured', 'is_active'], 'teachers_featured_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
