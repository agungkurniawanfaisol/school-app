<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\School;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        $schools = School::query()->where('is_active', true)->orderBy('id')->get();

        if ($schools->isEmpty()) {
            return;
        }

        foreach ($schools as $school) {
            AcademicYear::query()->updateOrCreate(
                ['school_id' => $school->id, 'label' => '2025/2026'],
                ['is_active' => false],
            );

            AcademicYear::query()->updateOrCreate(
                ['school_id' => $school->id, 'label' => '2026/2027'],
                ['is_active' => true],
            );
        }
    }
}
