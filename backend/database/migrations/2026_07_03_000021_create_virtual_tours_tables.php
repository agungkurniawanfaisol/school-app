<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('virtual_tours', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 250);
            $table->string('slug', 270)->unique();
            $table->text('description')->nullable();
            $table->foreignId('start_scene_id')->nullable()->index();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('order')->default(0)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'virtual_tours_school_active_order_idx');
        });

        Schema::create('virtual_tour_scenes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('virtual_tour_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 250);
            $table->string('image', 500);
            $table->decimal('initial_pitch', 8, 2)->default(0);
            $table->decimal('initial_yaw', 8, 2)->default(0);
            $table->integer('order')->default(0)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['virtual_tour_id', 'order'], 'virtual_tour_scenes_tour_order_idx');
        });

        Schema::table('virtual_tours', function (Blueprint $table) {
            $table->foreign('start_scene_id')
                ->references('id')
                ->on('virtual_tour_scenes')
                ->nullOnDelete();
        });

        Schema::create('virtual_tour_hotspots', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('virtual_tour_scene_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('target_scene_id')->index()->constrained('virtual_tour_scenes')->cascadeOnDelete();
            $table->string('label', 150);
            $table->decimal('pitch', 8, 2);
            $table->decimal('yaw', 8, 2);
            $table->integer('order')->default(0)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['virtual_tour_scene_id', 'order'], 'virtual_tour_hotspots_scene_order_idx');
        });
    }

    public function down(): void
    {
        Schema::table('virtual_tours', function (Blueprint $table) {
            $table->dropForeign(['start_scene_id']);
        });
        Schema::dropIfExists('virtual_tour_hotspots');
        Schema::dropIfExists('virtual_tour_scenes');
        Schema::dropIfExists('virtual_tours');
    }
};
