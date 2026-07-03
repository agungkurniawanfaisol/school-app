<?php

namespace Tests\Feature\Admin;

use App\Models\Course;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class CourseEnrollmentAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'course-enrollments';

    private function validPayload(): array
    {
        return [
            'course_id' => Course::factory()->create()->id,
            'student_name' => 'Ahmad Fauzi',
            'student_email' => 'ahmad@example.com',
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
            'course_id',
            'student_name',
            'student_email',
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
        $this->assertAdminUpdate(self::RESOURCE, $id, ['student_name' => 'Updated Student']);
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }
}
