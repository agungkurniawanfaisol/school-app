<?php

namespace Tests\Feature\Api;

use App\Models\StudentActivity;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class StudentActivityApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_student_activities(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/student-activities',
            StudentActivity::factory(),
            StudentActivity::factory()->inactive(),
        );
    }

    public function test_show_returns_student_activity_by_slug(): void
    {
        $activity = StudentActivity::factory()->create();

        $this->assertPublicShowBySlug('/api/v1/student-activities', $activity, $activity->slug);
    }

    public function test_inactive_student_activity_returns_404_on_show(): void
    {
        $activity = StudentActivity::factory()->inactive()->create();

        $this->assertInactiveHiddenFromShow('/api/v1/student-activities', $activity);
    }
}
