<?php

namespace Tests\Feature\Admin;

use App\Models\CourseEnrollment;
use App\Models\CourseLesson;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class CourseProgressAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'course-progress';

    private function validPayload(): array
    {
        return [
            'course_enrollment_id' => CourseEnrollment::factory()->create()->id,
            'course_lesson_id' => CourseLesson::factory()->create()->id,
        ];
    }

    public function test_guest_cannot_access(): void
    {
        $this->assertAdminGuestCannotAccess(self::RESOURCE);
    }

    public function test_non_admin_forbidden(): void
    {
        $this->assertNonAdminForbidden(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_index(): void
    {
        $this->assertAdminCanIndex(self::RESOURCE);
    }

    public function test_store_validation_fails(): void
    {
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], [
            'course_enrollment_id',
            'course_lesson_id',
        ]);
    }

    public function test_admin_can_store(): void
    {
        $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_show(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminShow(self::RESOURCE, $id);
    }

    public function test_admin_can_update(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminUpdate(self::RESOURCE, $id, ['is_completed' => true]);
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }
}
