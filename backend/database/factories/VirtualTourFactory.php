<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\VirtualTour;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<VirtualTour>
 */
class VirtualTourFactory extends Factory
{
    protected $model = VirtualTour::class;

    public function definition(): array
    {
        $title = fake()->words(3, true);

        return [
            'school_id' => School::factory(),
            'title' => Str::title($title),
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'description' => fake()->sentence(),
            'is_active' => true,
            'order' => fake()->numberBetween(0, 10),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
