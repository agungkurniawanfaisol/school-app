<?php

namespace Database\Factories;

use App\Models\Facility;
use App\Models\FacilityPhoto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FacilityPhoto>
 */
class FacilityPhotoFactory extends Factory
{
    protected $model = FacilityPhoto::class;

    public function definition(): array
    {
        return [
            'facility_id' => Facility::factory(),
            'path' => '/storage/facilities/'.fake()->uuid().'.jpg',
            'caption' => fake()->sentence(),
            'order' => fake()->numberBetween(0, 5),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
