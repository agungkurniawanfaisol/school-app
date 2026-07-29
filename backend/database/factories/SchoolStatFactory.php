<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\SchoolStat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SchoolStat>
 */
class SchoolStatFactory extends Factory
{
    protected $model = SchoolStat::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'icon' => fake()->randomElement(['graduation-cap', 'users', 'book-open']),
            'label' => fake()->words(2, true),
            'value' => (string) fake()->numberBetween(100, 999),
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
