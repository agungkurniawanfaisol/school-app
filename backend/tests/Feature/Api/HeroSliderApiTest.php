<?php

namespace Tests\Feature\Api;

use App\Models\HeroSlider;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class HeroSliderApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_hero_sliders(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/hero-sliders',
            HeroSlider::factory(),
            HeroSlider::factory()->inactive(),
        );
    }
}
