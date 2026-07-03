<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'name' => fake()->name(),
            'role' => fake()->randomElement(['Orang Tua', 'Alumni']),
            'content' => fake()->paragraph(),
            'rating' => fake()->numberBetween(4, 5),
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
            'is_featured' => false,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
