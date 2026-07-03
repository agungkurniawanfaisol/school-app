<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\StudentActivity;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<StudentActivity>
 */
class StudentActivityFactory extends Factory
{
    protected $model = StudentActivity::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'school_id' => School::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'excerpt' => fake()->sentence(),
            'content' => fake()->paragraph(),
            'category' => fake()->word(),
            'status' => 'published',
            'activity_date' => fake()->date(),
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
            'is_featured' => false,
            'published_at' => now(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
