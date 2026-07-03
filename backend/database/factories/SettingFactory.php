<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Setting>
 */
class SettingFactory extends Factory
{
    protected $model = Setting::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'group' => 'general',
            'key' => 'key_'.Str::random(8),
            'value' => fake()->word(),
            'type' => 'string',
        ];
    }
}
