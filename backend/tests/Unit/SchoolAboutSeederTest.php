<?php

namespace Tests\Unit;

use App\Models\School;
use Database\Seeders\SchoolAboutSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SchoolAboutSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_populates_about_content_for_school(): void
    {
        School::factory()->create(['slug' => 'nurul-hikmah', 'description' => null, 'vision' => null, 'mission' => null]);

        $this->seed(SchoolAboutSeeder::class);

        $school = School::query()->where('slug', 'nurul-hikmah')->firstOrFail();

        $this->assertNotEmpty($school->description);
        $this->assertStringContainsString('1998', $school->description);
        $this->assertNotEmpty($school->vision);
        $this->assertNotEmpty($school->mission);
        $this->assertStringContainsString('Al-Qur', $school->mission);
    }
}
