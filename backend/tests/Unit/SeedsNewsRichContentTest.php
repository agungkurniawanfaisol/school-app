<?php

namespace Tests\Unit;

use App\Models\News;
use App\Models\School;
use App\Models\User;
use Database\Seeders\Concerns\SeedsNewsRichContent;
use Database\Seeders\DemoContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SeedsNewsRichContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seeder_creates_rich_news_with_media_blocks(): void
    {
        School::factory()->create(['slug' => 'nurul-hikmah']);
        User::factory()->create([
            'email' => 'admin@nurulhikmah.sch.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $this->seed(DemoContentSeeder::class);

        $news = News::query()->where('slug', 'pembukaan-pmb-2026')->firstOrFail();

        $this->assertNull($news->content);
        $this->assertNotNull($news->thumbnail);
        $this->assertIsArray($news->content_json);
        $this->assertSame('doc', $news->content_json['type'] ?? null);

        $json = json_encode($news->content_json);
        $this->assertStringContainsString('youtube', $json);
        $this->assertStringContainsString('videoBlock', $json);
        $this->assertStringContainsString('orderedList', $json);
        $this->assertStringContainsString('image', $json);
    }

    public function test_news_rich_profiles_include_required_block_types(): void
    {
        $seeder = new class
        {
            use SeedsNewsRichContent;

            public function profiles(): array
            {
                return $this->newsRichProfiles();
            }
        };

        foreach ($seeder->profiles() as $slug => $profile) {
            $json = json_encode($profile['content_json']);
            $this->assertNotEmpty($profile['thumbnail'], "thumbnail missing for {$slug}");
            $this->assertStringContainsString('orderedList', $json, "orderedList missing for {$slug}");
            $this->assertStringContainsString('image', $json, "image missing for {$slug}");
        }

        $pmb = json_encode($seeder->profiles()['pembukaan-pmb-2026']['content_json']);
        $this->assertStringContainsString('youtube', $pmb);
        $this->assertStringContainsString('videoBlock', $pmb);
        $this->assertCount(10, $seeder->profiles());
    }
}
