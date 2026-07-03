<?php

namespace Database\Factories;

use App\Models\CourseLesson;
use App\Models\CourseModule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CourseLesson>
 */
class CourseLessonFactory extends Factory
{
    protected $model = CourseLesson::class;

    public function definition(): array
    {
        $title = fake()->words(3, true);

        return [
            'course_module_id' => CourseModule::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'type' => 'video',
            'content' => fake()->paragraph(),
            'duration_minutes' => fake()->numberBetween(5, 60),
            'order' => fake()->numberBetween(0, 5),
            'is_active' => true,
            'is_free_preview' => false,
        ];
    }
}
