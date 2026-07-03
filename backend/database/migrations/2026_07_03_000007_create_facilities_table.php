<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('name', 250);
            $table->string('slug', 270)->unique();
            $table->string('description', 1000)->nullable();
            $table->string('thumbnail', 500)->nullable();
            $table->string('category', 100)->nullable()->index();
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'facilities_school_active_order_idx');
            $table->index(['is_featured', 'is_active'], 'facilities_featured_active_idx');
        });

        Schema::create('facility_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_id')->index()->constrained()->cascadeOnDelete();
            $table->string('path', 500);
            $table->string('caption', 250)->nullable();
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['facility_id', 'is_active', 'order'], 'facility_photos_facility_active_order_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_photos');
        Schema::dropIfExists('facilities');
    }
};
