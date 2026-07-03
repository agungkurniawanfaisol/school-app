<?php

namespace Tests\Feature\Admin;

use Illuminate\Support\Str;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class TeacherAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'teachers';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'name' => 'Ustadz Ahmad',
            'slug' => 'ustadz-ahmad-'.Str::random(6),
            'bio' => 'Ringkasan singkat guru.',
            'content' => '<p>Konten lengkap guru.</p>',
            'content_json' => ['type' => 'doc', 'content' => []],
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
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['school_id', 'name']);
    }

    public function test_admin_can_store(): void
    {
        $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_store_with_auto_slug(): void
    {
        $payload = $this->validPayload();
        unset($payload['slug']);

        $response = $this->actingAsAdmin()
            ->postJson($this->adminUrl(self::RESOURCE), $payload);

        $response->assertCreated()
            ->assertJsonPath('data.slug', Str::slug($payload['name']));
    }

    public function test_admin_can_show(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminShow(self::RESOURCE, $uuid);
    }

    public function test_admin_can_update(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminUpdate(self::RESOURCE, $uuid, ['name' => 'Updated Teacher']);
    }

    public function test_admin_can_deactivate(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());

        $this->actingAsAdmin()
            ->putJson($this->adminUrl(self::RESOURCE).'/'.$uuid, ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('data.is_active', false);
    }

    public function test_admin_can_destroy(): void
    {
        $uuid = $this->assertAdminStoreSuccessUuid(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $uuid);
    }
}
