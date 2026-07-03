<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 250);
            $table->string('slug', 270)->unique();
            $table->string('excerpt', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('thumbnail', 500)->nullable();
            $table->string('category', 100)->nullable()->index();
            $table->string('level', 50)->nullable()->index();
            $table->unsignedInteger('duration_minutes')->default(0);
            $table->decimal('price', 12, 2)->default(0);
            $table->string('status', 20)->default('draft')->index();
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['school_id', 'is_active', 'order'], 'courses_school_active_order_idx');
            $table->index(['is_active', 'published_at'], 'courses_active_published_idx');
            $table->index(['is_featured', 'is_active'], 'courses_featured_active_idx');
            $table->index(['school_id', 'category', 'is_active'], 'courses_school_cat_active_idx');
        });

        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 250);
            $table->string('slug', 270);
            $table->text('description')->nullable();
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['course_id', 'slug']);
            $table->index(['course_id', 'is_active', 'order'], 'course_modules_course_active_order_idx');
        });

        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_module_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 250);
            $table->string('slug', 270);
            $table->string('type', 30)->default('text')->index();
            $table->longText('content')->nullable();
            $table->string('video_url', 500)->nullable();
            $table->unsignedInteger('duration_minutes')->default(0);
            $table->integer('order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_free_preview')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['course_module_id', 'slug']);
            $table->index(['course_module_id', 'is_active', 'order'], 'course_lessons_module_active_order_idx');
        });

        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->index()->constrained()->nullOnDelete();
            $table->string('student_name', 200);
            $table->string('student_email', 150)->index();
            $table->string('status', 20)->default('active')->index();
            $table->timestamp('enrolled_at')->nullable()->index();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['course_id', 'status'], 'enrollments_course_status_idx');
        });

        Schema::create('course_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_enrollment_id')->index()->constrained()->cascadeOnDelete();
            $table->foreignId('course_lesson_id')->index()->constrained()->cascadeOnDelete();
            $table->boolean('is_completed')->default(false)->index();
            $table->unsignedTinyInteger('progress_percent')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['course_enrollment_id', 'course_lesson_id'], 'progress_enrollment_lesson_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_progress');
        Schema::dropIfExists('course_enrollments');
        Schema::dropIfExists('course_lessons');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
    }
};
