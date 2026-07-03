<?php

namespace Database\Factories;

use App\Models\CourseEnrollment;
use App\Models\CourseLesson;
use App\Models\CourseProgress;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CourseProgress>
 */
class CourseProgressFactory extends Factory
{
    protected $model = CourseProgress::class;

    public function definition(): array
    {
        return [
            'course_enrollment_id' => CourseEnrollment::factory(),
            'course_lesson_id' => CourseLesson::factory(),
            'is_completed' => false,
            'progress_percent' => fake()->numberBetween(0, 100),
        ];
    }
}
