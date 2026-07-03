<?php

namespace Database\Factories;

use App\Models\VirtualTour;
use App\Models\VirtualTourScene;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VirtualTourScene>
 */
class VirtualTourSceneFactory extends Factory
{
    protected $model = VirtualTourScene::class;

    public function definition(): array
    {
        return [
            'virtual_tour_id' => VirtualTour::factory(),
            'title' => fake()->words(2, true),
            'image' => '/storage/uploads/virtual-tour/sample.jpg',
            'initial_pitch' => 0,
            'initial_yaw' => 0,
            'order' => fake()->numberBetween(0, 5),
        ];
    }
}
