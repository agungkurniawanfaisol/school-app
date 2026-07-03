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
}
