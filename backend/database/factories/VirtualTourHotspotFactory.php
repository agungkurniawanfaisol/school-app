<?php

namespace Database\Factories;

use App\Models\VirtualTourHotspot;
use App\Models\VirtualTourScene;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VirtualTourHotspot>
 */
class VirtualTourHotspotFactory extends Factory
{
    protected $model = VirtualTourHotspot::class;

    public function definition(): array
    {
        return [
            'virtual_tour_scene_id' => VirtualTourScene::factory(),
            'target_scene_id' => VirtualTourScene::factory(),
            'label' => fake()->words(2, true),
            'pitch' => fake()->randomFloat(2, -30, 30),
            'yaw' => fake()->randomFloat(2, -180, 180),
            'order' => 0,
        ];
    }
}
