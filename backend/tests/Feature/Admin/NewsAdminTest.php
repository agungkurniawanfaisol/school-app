<?php

namespace Tests\Feature\Admin;

use App\Models\News;
use App\Models\School;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class NewsAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'news';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'title' => 'Berita Terbaru',
            'slug' => 'berita-terbaru-'.Str::random(6),
            'content' => 'Konten berita lengkap.',
            'status' => 'published',
            'is_active' => true,
            'published_at' => now()->toDateString(),
        ];
    }

    public function test_guest_cannot_access(): void
    {
        $this->assertAdminGuestCannotAccess(self::RESOURCE);
    }

    public function test_non_admin_forbidden(): void
    {
        $this->assertNonAdminForbidden(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_index(): void
    {
        $this->assertAdminCanIndex(self::RESOURCE);
    }

    public function test_store_validation_fails(): void
    {
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['school_id', 'title']);
    }

    public function test_admin_can_store(): void
    {
        $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_store_with_content_json(): void
    {
        $payload = $this->validPayload();
        unset($payload['content']);
        $payload['content_json'] = [
            'type' => 'doc',
            'content' => [
                ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Halo']]],
            ],
        ];

        $response = $this->actingAsAdmin()
            ->postJson('/api/admin/news', $payload)
            ->assertCreated();

        $this->assertNotNull($response->json('data.uuid'));
        $this->assertIsArray($response->json('data.content_json'));
    }

    public function test_admin_can_show(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminShow(self::RESOURCE, $uuid);
    }

    public function test_admin_can_update(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminUpdate(self::RESOURCE, $uuid, ['title' => 'Updated News Title']);
    }

    public function test_admin_can_destroy(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $uuid);
    }

    public function test_admin_can_publish_and_unpublish(): void
    {
        $payload = $this->validPayload();
        $payload['status'] = 'draft';
        $payload['published_at'] = null;

        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $payload);

        $this->actingAsAdmin()
            ->patchJson("/api/admin/news/{$uuid}/publish")
            ->assertOk()
            ->assertJsonPath('data.status', 'published');

        $this->actingAsAdmin()
            ->patchJson("/api/admin/news/{$uuid}/unpublish")
            ->assertOk()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.published_at', null)
            ->assertJsonPath('data.publish_ends_at', null);
    }

    public function test_admin_can_publish_with_schedule(): void
    {
        $payload = $this->validPayload();
        $payload['status'] = 'draft';
        $payload['published_at'] = null;

        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $payload);

        $starts = now()->addDay()->startOfMinute();
        $ends = now()->addDays(7)->startOfMinute();

        $this->actingAsAdmin()
            ->patchJson("/api/admin/news/{$uuid}/publish", [
                'published_at' => $starts->toIso8601String(),
                'publish_ends_at' => $ends->toIso8601String(),
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'published')
            ->assertJsonPath('data.display_status', 'scheduled');
    }

    public function test_publish_rejects_invalid_schedule_range(): void
    {
        $payload = $this->validPayload();
        $payload['status'] = 'draft';
        $payload['published_at'] = null;

        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $payload);

        $this->actingAsAdmin()
            ->patchJson("/api/admin/news/{$uuid}/publish", [
                'published_at' => now()->addDay()->toIso8601String(),
                'publish_ends_at' => now()->toIso8601String(),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['publish_ends_at']);
    }

    public function test_admin_can_filter_by_display_status(): void
    {
        $school = $this->createSchool();
        News::factory()->create(['school_id' => $school->id, 'status' => 'draft']);
        News::factory()->scheduled()->create(['school_id' => $school->id]);
        News::factory()->published()->create(['school_id' => $school->id]);
        News::factory()->ended()->create(['school_id' => $school->id]);

        $this->actingAsAdmin()
            ->getJson('/api/admin/news?display_status=live')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_published_news_appears_in_public_api_after_admin_create(): void
    {
        $payload = $this->validPayload();
        $payload['title'] = 'Berita Cache Smoke Test';
        $payload['slug'] = 'berita-cache-smoke-'.Str::random(6);

        $this->actingAsAdmin()
            ->postJson('/api/admin/news', $payload)
            ->assertCreated();

        $response = $this->getJson('/api/v1/news');

        $response->assertOk();
        $slugs = collect($response->json('data'))->pluck('slug')->all();
        $this->assertContains($payload['slug'], $slugs);
    }

    public function test_draft_news_not_visible_by_public_uuid(): void
    {
        $school = School::factory()->create();
        $news = News::factory()->create([
            'school_id' => $school->id,
            'status' => 'draft',
            'is_active' => true,
            'published_at' => null,
        ]);

        $this->getJson("/api/v1/news/uuid/{$news->uuid}")
            ->assertNotFound();
    }

    public function test_store_sanitizes_malicious_html_content(): void
    {
        $payload = $this->validPayload();
        $payload['content'] = '<p>Aman</p><script>alert("xss")</script>';
        $payload['thumbnail'] = 'javascript:alert(1)';

        $response = $this->actingAsAdmin()
            ->postJson('/api/admin/news', $payload)
            ->assertCreated();

        $news = News::query()->where('uuid', $response->json('data.uuid'))->firstOrFail();

        $this->assertStringNotContainsString('<script>', (string) $news->content);
        $this->assertStringContainsString('Aman', (string) $news->content);
        $this->assertNull($news->thumbnail);
    }
}
