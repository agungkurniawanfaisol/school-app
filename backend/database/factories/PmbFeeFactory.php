<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Models\PmbFee;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PmbFee>
 */
class PmbFeeFactory extends Factory
{
    protected $model = PmbFee::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'academic_year_id' => function (array $attributes) {
                return AcademicYear::factory()->create([
                    'school_id' => $attributes['school_id'],
                ])->id;
            },
            'amount' => 350000,
            'notes' => null,
            'is_active' => false,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }
}
