<?php

namespace Tests\Feature\Api;

use App\Models\Facility;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class FacilityApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_facilities(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/facilities',
            Facility::factory(),
            Facility::factory()->inactive(),
        );
    }

    public function test_show_returns_facility_by_slug(): void
    {
        $facility = Facility::factory()->create();

        $this->assertPublicShowBySlug('/api/v1/facilities', $facility, $facility->slug);
    }

    public function test_inactive_facility_returns_404_on_show(): void
    {
        $facility = Facility::factory()->inactive()->create();

        $this->assertInactiveHiddenFromShow('/api/v1/facilities', $facility);
    }
}
