<?php

namespace Tests\Feature\Admin;

use Illuminate\Support\Str;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class FacilityAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'facilities';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'name' => 'Perpustakaan',
            'slug' => 'perpustakaan-'.Str::random(6),
            'photos' => [
                ['path' => '/images/facilities/sample.jpg', 'caption' => 'Ruang baca'],
                ['path' => '/images/facilities/sample-2.jpg', 'caption' => 'Rak buku'],
            ],
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
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['school_id', 'name', 'slug']);
    }

    public function test_admin_can_store(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());

        $this->actingAsAdmin()
            ->getJson($this->adminUrl(self::RESOURCE).'/'.$uuid)
            ->assertOk()
            ->assertJsonCount(2, 'data.photos');
    }

    public function test_admin_can_show(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminShow(self::RESOURCE, $uuid);
    }

    public function test_admin_can_update(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminUpdate(self::RESOURCE, $uuid, ['name' => 'Updated Facility']);
    }

    public function test_admin_can_destroy(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $uuid);
    }
}
