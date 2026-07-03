<?php

namespace Tests\Feature\Admin;

use App\Models\School;
use App\Models\StudentActivity;
use Illuminate\Support\Str;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class StudentActivityAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'student-activities';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'title' => 'Kegiatan Outbound',
            'slug' => 'kegiatan-outbound-'.Str::random(6),
            'content' => 'Deskripsi kegiatan.',
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
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['school_id', 'title']);
    }

    public function test_admin_can_store(): void
    {
        $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_show(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminShow(self::RESOURCE, $uuid);
    }

    public function test_admin_can_update(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminUpdate(self::RESOURCE, $uuid, ['title' => 'Updated Activity']);
    }

    public function test_admin_can_destroy(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $uuid);
    }

    public function test_admin_can_publish_and_unpublish(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());

        $this->actingAsAdmin()
            ->patchJson("/api/admin/student-activities/{$uuid}/publish")
            ->assertOk()
            ->assertJsonPath('data.status', 'published');

        $this->actingAsAdmin()
            ->patchJson("/api/admin/student-activities/{$uuid}/unpublish")
            ->assertOk()
            ->assertJsonPath('data.status', 'draft');
    }

    public function test_draft_activity_not_visible_by_public_uuid(): void
    {
        $school = School::factory()->create();
        $activity = StudentActivity::factory()->create([
            'school_id' => $school->id,
            'status' => 'draft',
            'is_active' => true,
            'published_at' => null,
        ]);

        $this->getJson("/api/v1/student-activities/uuid/{$activity->uuid}")
            ->assertNotFound();
    }
}
