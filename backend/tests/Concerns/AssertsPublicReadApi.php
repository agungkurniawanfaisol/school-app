<?php

namespace Tests\Concerns;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

trait AssertsPublicReadApi
{
    protected function assertPublicListReturnsOnlyActive(
        string $url,
        Factory $activeFactory,
        Factory $inactiveFactory,
    ): void {
        $active = $activeFactory->create();
        $inactiveFactory->create();

        $response = $this->getJson($url);

        $response->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(1, 'data');

        $ids = collect($response->json('data'))->pluck('id')->all();
        $this->assertContains($active->id, $ids);
    }

    protected function assertPublicShowBySlug(
        string $urlPrefix,
        Model $model,
        string $slug,
    ): void {
        $this->getJson("{$urlPrefix}/{$slug}")
            ->assertOk()
            ->assertJsonPath('data.slug', $slug)
            ->assertJsonPath('data.id', $model->id);
    }

    protected function assertPublicShowBySlugNotFound(string $urlPrefix, string $slug): void
    {
        $this->getJson("{$urlPrefix}/{$slug}")
            ->assertNotFound();
    }

    protected function assertInactiveHiddenFromShow(string $urlPrefix, Model $model): void
    {
        $slug = $model->slug ?? $model->getAttribute('slug');
        if (! $slug) {
            $this->markTestSkipped('Model has no slug attribute.');
        }

        $this->getJson("{$urlPrefix}/{$slug}")->assertNotFound();
    }
}
