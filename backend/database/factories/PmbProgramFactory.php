<?php

namespace Database\Factories;

use App\Models\PmbProgram;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PmbProgram>
 */
class PmbProgramFactory extends Factory
{
    protected $model = PmbProgram::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'code' => 'reguler',
            'name' => 'Reguler',
            'sort_order' => 10,
            'is_active' => true,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function reguler(): static
    {
        return $this->state(fn () => [
            'code' => 'reguler',
            'name' => 'Reguler',
            'sort_order' => 10,
        ]);
    }

    public function icp(): static
    {
        return $this->state(fn () => [
            'code' => 'icp',
            'name' => 'ICP',
            'sort_order' => 20,
        ]);
    }
}
