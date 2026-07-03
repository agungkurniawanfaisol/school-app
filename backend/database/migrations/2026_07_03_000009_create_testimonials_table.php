<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('name', 200);
            $table->string('role', 150)->nullable();
            $table->text('content');
            $table->string('photo', 500)->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'testimonials_school_active_order_idx');
            $table->index(['is_featured', 'is_active'], 'testimonials_featured_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
