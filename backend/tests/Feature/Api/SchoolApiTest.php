<?php

namespace Tests\Feature\Api;

use App\Models\School;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class SchoolApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_schools(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/schools',
            School::factory(),
            School::factory()->inactive(),
        );
    }

    public function test_show_returns_school_by_slug(): void
    {
        $school = School::factory()->create();

        $this->assertPublicShowBySlug('/api/v1/schools', $school, $school->slug);
    }

    public function test_inactive_school_returns_404_on_show(): void
    {
        $school = School::factory()->inactive()->create();

        $this->assertInactiveHiddenFromShow('/api/v1/schools', $school);
    }
}
