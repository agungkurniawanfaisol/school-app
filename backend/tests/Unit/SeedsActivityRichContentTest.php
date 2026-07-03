<?php

namespace Tests\Unit;

use App\Models\School;
use App\Models\StudentActivity;
use App\Models\User;
use Database\Seeders\Concerns\SeedsActivityRichContent;
use Database\Seeders\DemoContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SeedsActivityRichContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seeder_creates_rich_student_activities(): void
    {
        School::factory()->create(['slug' => 'nurul-hikmah']);
        User::factory()->create([
            'email' => 'admin@nurulhikmah.sch.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $this->seed(DemoContentSeeder::class);

        $activity = StudentActivity::query()->where('slug', 'lomba-tahfidz-2026')->firstOrFail();

        $this->assertNull($activity->content);
        $this->assertNotNull($activity->thumbnail);
        $this->assertSame('published', $activity->status);
        $this->assertIsArray($activity->content_json);

        $json = json_encode($activity->content_json);
        $this->assertStringContainsString('youtube', $json);
        $this->assertStringContainsString('orderedList', $json);
        $this->assertStringContainsString('image', $json);
    }

    public function test_activity_rich_profiles_have_photos_and_youtube(): void
    {
        $seeder = new class
        {
            use SeedsActivityRichContent;

            public function profiles(): array
            {
                return $this->activityRichProfiles();
            }
        };

        $this->assertCount(10, $seeder->profiles());

        foreach ($seeder->profiles() as $slug => $profile) {
            $json = json_encode($profile['content_json']);
            $this->assertNotEmpty($profile['thumbnail'], "thumbnail missing for {$slug}");
            $this->assertStringContainsString('image', $json, "image missing for {$slug}");
            $this->assertStringContainsString('youtube', $json, "youtube missing for {$slug}");
        }
    }
}
