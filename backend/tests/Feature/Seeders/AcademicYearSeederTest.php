<?php

namespace Tests\Feature\Seeders;

use App\Models\AcademicYear;
use App\Models\School;
use Database\Seeders\AcademicYearSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicYearSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_active_academic_year_for_default_school(): void
    {
        $school = School::factory()->create(['slug' => 'nurul-hikmah', 'is_active' => true]);

        $this->seed(AcademicYearSeeder::class);

        $active = AcademicYear::query()
            ->where('school_id', $school->id)
            ->where('is_active', true)
            ->first();

        $this->assertNotNull($active);
        $this->assertSame('2026/2027', $active->label);

        $this->getJson('/api/v1/academic-years/active?school_id='.$school->id)
            ->assertOk()
            ->assertJsonPath('data.label', '2026/2027');
    }
}
