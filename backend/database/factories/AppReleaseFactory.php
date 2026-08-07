<?php

namespace Database\Factories;

use App\Models\AppRelease;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppRelease>
 */
class AppReleaseFactory extends Factory
{
    protected $model = AppRelease::class;

    public function definition(): array
    {
        return [
            'version' => fake()->unique()->numerify('#.#.#'),
            'title' => fake()->sentence(3),
            'body' => fake()->paragraph(),
            'published_at' => now(),
            'is_published' => true,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'is_published' => true,
            'published_at' => now(),
        ]);
    }
}
