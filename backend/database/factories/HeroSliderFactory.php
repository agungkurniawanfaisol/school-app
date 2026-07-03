<?php

namespace Database\Factories;

use App\Models\HeroSlider;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HeroSlider>
 */
class HeroSliderFactory extends Factory
{
    protected $model = HeroSlider::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'title' => fake()->sentence(4),
            'subtitle' => fake()->sentence(),
            'image' => '/images/hero.jpg',
            'cta_text' => 'Daftar',
            'cta_url' => '/pmb/daftar',
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
