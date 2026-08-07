<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Models\PmbFee;
use App\Models\PmbProgram;
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
            'pmb_program_id' => function (array $attributes) {
                return $this->resolveProgramId(
                    $this->resolveSchoolId($attributes),
                    PmbFee::PROGRAM_REGULER,
                    'Reguler',
                    10,
                );
            },
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

    public function kbReguler(): static
    {
        return $this->withProgram(PmbFee::JENJANG_KB, PmbFee::PROGRAM_REGULER, 'KB Reguler', 'Reguler', 10);
    }

    public function kbIcp(): static
    {
        return $this->withProgram(PmbFee::JENJANG_KB, PmbFee::PROGRAM_ICP, 'KB ICP', 'ICP', 20);
    }

    public function tkReguler(): static
    {
        return $this->withProgram(PmbFee::JENJANG_TK, PmbFee::PROGRAM_REGULER, 'TK Reguler', 'Reguler', 10);
    }

    public function tkIcp(): static
    {
        return $this->withProgram(PmbFee::JENJANG_TK, PmbFee::PROGRAM_ICP, 'TK ICP', 'ICP', 20);
    }

    public function sdReguler(): static
    {
        return $this->withProgram(PmbFee::JENJANG_SD, PmbFee::PROGRAM_REGULER, 'SD Reguler', 'Reguler', 10);
    }

    public function sdIcp(): static
    {
        return $this->withProgram(PmbFee::JENJANG_SD, PmbFee::PROGRAM_ICP, 'SD ICP', 'ICP', 20);
    }

    private function withProgram(
        string $jenjang,
        string $code,
        string $feeName,
        string $programName,
        int $sortOrder,
    ): static {
        return $this->state(function (array $attributes) use ($jenjang, $code, $feeName, $programName, $sortOrder) {
            return [
                'name' => $feeName,
                'jenjang' => $jenjang,
                'program' => $code,
                'pmb_program_id' => $this->resolveProgramId(
                    $this->resolveSchoolId($attributes),
                    $code,
                    $programName,
                    $sortOrder,
                ),
            ];
        });
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function resolveSchoolId(array $attributes): int
    {
        $schoolId = $attributes['school_id'] ?? null;

        if ($schoolId instanceof School) {
            return (int) $schoolId->id;
        }

        if (is_numeric($schoolId)) {
            return (int) $schoolId;
        }

        return (int) School::factory()->create()->id;
    }

    private function resolveProgramId(int $schoolId, string $code, string $name, int $sortOrder): int
    {
        $existing = PmbProgram::query()
            ->where('school_id', $schoolId)
            ->where('code', $code)
            ->first();

        if ($existing) {
            return (int) $existing->id;
        }

        return (int) PmbProgram::factory()->create([
            'school_id' => $schoolId,
            'code' => $code,
            'name' => $name,
            'sort_order' => $sortOrder,
            'is_active' => true,
        ])->id;
    }
}
