<?php

namespace Tests\Feature\Api;

use App\Models\Curriculum;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class CurriculumApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_curriculums(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/curriculums',
            Curriculum::factory(),
            Curriculum::factory()->inactive(),
        );
    }

    public function test_show_returns_curriculum_by_slug(): void
    {
        $curriculum = Curriculum::factory()->create();

        $this->assertPublicShowBySlug('/api/v1/curriculums', $curriculum, $curriculum->slug);
    }

    public function test_inactive_curriculum_returns_404_on_show(): void
    {
        $curriculum = Curriculum::factory()->inactive()->create();

        $this->assertInactiveHiddenFromShow('/api/v1/curriculums', $curriculum);
    }
}
