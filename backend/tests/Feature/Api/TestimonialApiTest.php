<?php

namespace Tests\Feature\Api;

use App\Models\Testimonial;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class TestimonialApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_testimonials(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/testimonials',
            Testimonial::factory(),
            Testimonial::factory()->inactive(),
        );
    }
}
