<?php

namespace Tests\Feature\Api;

use App\Models\Course;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class CourseApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_courses(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/courses',
            Course::factory(),
            Course::factory()->inactive(),
        );
    }

    public function test_show_returns_course_by_slug(): void
    {
        $course = Course::factory()->create();

        $this->assertPublicShowBySlug('/api/v1/courses', $course, $course->slug);
    }

    public function test_inactive_course_returns_404_on_show(): void
    {
        $course = Course::factory()->inactive()->create();

        $this->assertInactiveHiddenFromShow('/api/v1/courses', $course);
    }
}
