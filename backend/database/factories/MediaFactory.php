<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        $name = fake()->word().'.jpg';

        return [
            'user_id' => User::factory()->admin(),
            'filename' => $name,
            'original_name' => $name,
            'path' => '/storage/media/'.$name,
            'disk' => 'local',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(1000, 500000),
            'collection' => 'default',
        ];
    }
}
