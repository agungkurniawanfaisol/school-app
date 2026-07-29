<?php

namespace Tests\Feature\Api;

use App\Models\AcademicYear;
use App\Models\School;
use Tests\TestCase;

class AcademicYearApiTest extends TestCase
{
    public function test_active_returns_current_academic_year(): void
    {
        $school = School::factory()->create();
        AcademicYear::factory()->for($school)->create(['label' => '2025/2026', 'is_active' => false]);
        AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);

        $this->getJson('/api/v1/academic-years/active?school_id='.$school->id)
            ->assertOk()
            ->assertJsonPath('data.label', '2026/2027')
            ->assertJsonPath('data.is_active', true);
    }

    public function test_active_returns_404_when_not_configured(): void
    {
        $school = School::factory()->create();

        $this->getJson('/api/v1/academic-years/active?school_id='.$school->id)
            ->assertNotFound();
    }
}
