<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\SchoolValue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SchoolValue>
 */
class SchoolValueFactory extends Factory
{
    protected $model = SchoolValue::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'icon' => fake()->randomElement(['heart', 'sparkles', 'hand-heart', 'target']),
            'title' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
