<?php

namespace Tests\Unit;

use App\Models\Curriculum;
use App\Models\Facility;
use App\Models\News;
use App\Models\School;
use App\Models\StudentActivity;
use App\Models\Teacher;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DemoContentCountsTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_expected_demo_counts(): void
    {
        $this->seed(DatabaseSeeder::class);

        $school = School::query()->where('slug', 'nurul-hikmah')->firstOrFail();

        $this->assertNotEmpty($school->description);
        $this->assertNotEmpty($school->vision);
        $this->assertNotEmpty($school->mission);

        $this->assertSame(10, Curriculum::query()->where('school_id', $school->id)->where('is_active', true)->count());
        $this->assertSame(10, Teacher::query()->where('school_id', $school->id)->where('is_active', true)->count());
        $this->assertSame(20, Facility::query()->where('school_id', $school->id)->where('is_active', true)->count());
        $this->assertSame(10, StudentActivity::query()->where('school_id', $school->id)->where('is_active', true)->count());
        $this->assertSame(10, News::query()->where('school_id', $school->id)->where('is_active', true)->count());

        User::query()->where('email', 'admin@nurulhikmah.sch.id')->firstOrFail();
    }
}
