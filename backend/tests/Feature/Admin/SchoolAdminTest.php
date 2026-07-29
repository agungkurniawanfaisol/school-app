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

    public function test_admin_can_update_about_image(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $imageUrl = 'https://cdn.example.com/about.jpg';

        $response = $this->actingAsAdmin()->putJson('/api/admin/schools/'.$id, [
            'about_image' => $imageUrl,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.about_image', $imageUrl);

        $this->getJson('/api/v1/schools/'.$response->json('data.slug'))
            ->assertOk()
            ->assertJsonPath('data.about_image', $imageUrl);
    }

    public function test_admin_about_image_update_rejects_unsafe_url(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());

        $this->actingAsAdmin()->putJson('/api/admin/schools/'.$id, [
            'about_image' => 'javascript:alert(1)',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['about_image']);
    }

    public function test_admin_can_update_map_embed_url_from_iframe_html(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966';
        $iframe = '<iframe src="'.$embedUrl.'" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>';

        $response = $this->actingAsAdmin()->putJson('/api/admin/schools/'.$id, [
            'map_embed_url' => $iframe,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.map_embed_url', $embedUrl);

        $this->getJson('/api/v1/schools/'.$response->json('data.slug'))
            ->assertOk()
            ->assertJsonPath('data.map_embed_url', $embedUrl);
    }

    public function test_admin_map_embed_url_rejects_share_link(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());

        $this->actingAsAdmin()->putJson('/api/admin/schools/'.$id, [
            'map_embed_url' => 'https://maps.app.goo.gl/Abc123',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['map_embed_url']);
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }
}
