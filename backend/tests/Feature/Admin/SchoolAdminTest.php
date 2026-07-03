<?php

namespace Tests\Feature\Admin;

use Illuminate\Support\Str;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class SchoolAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'schools';

    private function validPayload(): array
    {
        return [
            'name' => 'Sekolah Nurul Hikmah',
            'slug' => 'sekolah-nurul-hikmah-'.Str::random(6),
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
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['name', 'slug']);
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
        $this->assertAdminUpdate(self::RESOURCE, $id, ['name' => 'Updated School Name']);
    }

    public function test_admin_can_update_vision_and_mission(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());

        $response = $this->actingAsAdmin()->putJson('/api/admin/schools/'.$id, [
            'vision' => 'Visi sekolah unggulan',
            'mission' => "1. Poin pertama\n2. Poin kedua",
        ]);

        $response->assertOk()
            ->assertJsonPath('data.vision', 'Visi sekolah unggulan')
            ->assertJsonPath('data.mission', "1. Poin pertama\n2. Poin kedua");
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }
}
