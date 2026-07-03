<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'school_id' => School::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'excerpt' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'category' => fake()->word(),
            'level' => fake()->randomElement(['pemula', 'menengah']),
            'duration_minutes' => fake()->numberBetween(30, 180),
            'price' => fake()->randomFloat(2, 0, 500000),
            'status' => 'published',
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
            'is_featured' => false,
            'published_at' => now()->subDay(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
