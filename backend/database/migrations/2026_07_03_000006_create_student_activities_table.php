<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 250);
            $table->string('slug', 270)->unique();
            $table->string('excerpt', 500)->nullable();
            $table->text('content')->nullable();
            $table->string('thumbnail', 500)->nullable();
            $table->string('category', 100)->nullable()->index();
            $table->date('activity_date')->nullable()->index();
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'activities_school_active_order_idx');
            $table->index(['is_active', 'published_at'], 'activities_active_published_idx');
            $table->index(['is_featured', 'is_active'], 'activities_featured_active_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_activities');
    }
};
