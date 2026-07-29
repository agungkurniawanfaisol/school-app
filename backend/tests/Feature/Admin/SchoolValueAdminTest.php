<?php

namespace Tests\Feature\Admin;

use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class SchoolValueAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'school-values';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'icon' => 'heart',
            'title' => 'Akhlak',
            'description' => 'Membentuk karakter mulia berdasarkan Al-Quran dan Sunnah.',
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
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['school_id', 'title', 'description']);
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
        $this->assertAdminUpdate(self::RESOURCE, $uuid, ['title' => 'Akhlak Mulia']);
    }

    public function test_admin_can_destroy(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $uuid);
    }
}
