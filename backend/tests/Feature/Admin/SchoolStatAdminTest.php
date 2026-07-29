<?php

namespace Tests\Feature\Admin;

use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class SchoolStatAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'school-stats';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'icon' => 'graduation-cap',
            'label' => 'Berdiri',
            'value' => '1998',
            'order' => 1,
            'is_active' => true,
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
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['school_id', 'label', 'value']);
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
        $this->assertAdminUpdate(self::RESOURCE, $uuid, ['value' => '2000']);
    }

    public function test_admin_can_destroy(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $uuid);
    }
}
