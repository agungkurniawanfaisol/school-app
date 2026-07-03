<?php

namespace Tests\Feature\Api;

use App\Models\News;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class NewsApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_published_active_news(): void
    {
        $published = News::factory()->published()->create();
        News::factory()->draft()->create();
        News::factory()->inactive()->create();

        $response = $this->getJson('/api/v1/news');

        $response->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(1, 'data');

        $ids = collect($response->json('data'))->pluck('id')->all();
        $this->assertContains($published->id, $ids);
    }

    public function test_show_returns_news_by_slug(): void
    {
        $news = News::factory()->published()->create();

        $this->assertPublicShowBySlug('/api/v1/news', $news, $news->slug);
    }

    public function test_inactive_news_returns_404_on_show(): void
    {
        $news = News::factory()->inactive()->create();

        $this->assertInactiveHiddenFromShow('/api/v1/news', $news);
    }

    public function test_scheduled_news_not_in_public_list(): void
    {
        News::factory()->scheduled()->create();
        News::factory()->published()->create();

        $response = $this->getJson('/api/v1/news');

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_ended_news_not_in_public_list_or_show(): void
    {
        $news = News::factory()->ended()->create();

        $this->getJson('/api/v1/news')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson("/api/v1/news/{$news->slug}")->assertNotFound();
    }

    public function test_list_supports_search_and_pagination(): void
    {
        News::factory()->published()->create(['title' => 'Prestasi Olimpiade', 'excerpt' => 'Siswa juara nasional']);
        News::factory()->published()->create(['title' => 'Kegiatan Ramadhan', 'excerpt' => 'Puasa bersama']);

        $this->getJson('/api/v1/news?search=olimpiade&per_page=1&page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Prestasi Olimpiade')
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1);
    }
}
