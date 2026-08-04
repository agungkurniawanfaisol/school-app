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
            'name' => 'SD Reguler',
            'jenjang' => PmbFee::JENJANG_SD,
            'program' => PmbFee::PROGRAM_REGULER,
            'amount' => 350000,
            'bank_name' => 'Bank Syariah Indonesia (BSI)',
            'account_number' => '1234567890',
            'account_holder' => 'Yayasan Nurul Hikmah',
            'notes' => null,
            'is_active' => false,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function tkReguler(): static
    {
        return $this->state(fn () => [
            'name' => 'TK Reguler',
            'jenjang' => PmbFee::JENJANG_TK,
            'program' => PmbFee::PROGRAM_REGULER,
        ]);
    }

    public function tkIcp(): static
    {
        return $this->state(fn () => [
            'name' => 'TK ICP',
            'jenjang' => PmbFee::JENJANG_TK,
            'program' => PmbFee::PROGRAM_ICP,
        ]);
    }

    public function sdReguler(): static
    {
        return $this->state(fn () => [
            'name' => 'SD Reguler',
            'jenjang' => PmbFee::JENJANG_SD,
            'program' => PmbFee::PROGRAM_REGULER,
        ]);
    }

    public function sdIcp(): static
    {
        return $this->state(fn () => [
            'name' => 'SD ICP',
            'jenjang' => PmbFee::JENJANG_SD,
            'program' => PmbFee::PROGRAM_ICP,
        ]);
    }
}
