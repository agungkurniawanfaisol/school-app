<?php

namespace Tests\Feature\Admin;

use Illuminate\Support\Str;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class CurriculumAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'curriculums';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'title' => 'Kurikulum Merdeka',
            'slug' => 'kurikulum-merdeka-'.Str::random(6),
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
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['school_id', 'title', 'slug']);
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
        $this->assertAdminUpdate(self::RESOURCE, $id, ['title' => 'Updated Curriculum']);
    }

    public function test_admin_can_update_without_changing_slug(): void
    {
        $payload = $this->validPayload();
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $payload);

        $this->actingAsAdmin()->putJson('/api/admin/curriculums/'.$id, [
            'title' => 'Judul Diperbarui',
            'slug' => $payload['slug'],
        ])->assertOk()
            ->assertJsonPath('data.slug', $payload['slug'])
            ->assertJsonPath('data.title', 'Judul Diperbarui');
    }

    public function test_admin_can_update_slug_when_unique(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $newSlug = 'program-unggulan-baru-'.Str::random(6);

        $this->actingAsAdmin()->putJson('/api/admin/curriculums/'.$id, [
            'slug' => $newSlug,
        ])->assertOk()
            ->assertJsonPath('data.slug', $newSlug);
    }

    public function test_admin_update_rejects_duplicate_slug(): void
    {
        $first = $this->validPayload();
        $this->assertAdminStoreSuccess(self::RESOURCE, $first);

        $second = $this->validPayload();
        $secondId = $this->assertAdminStoreSuccess(self::RESOURCE, $second);

        $this->actingAsAdmin()->putJson('/api/admin/curriculums/'.$secondId, [
            'slug' => $first['slug'],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }

    public function test_admin_can_store_with_content_json(): void
    {
        $payload = array_merge($this->validPayload(), [
            'content_json' => [
                'type' => 'doc',
                'content' => [
                    ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Program unggulan.']]],
                ],
            ],
        ]);

        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $payload);
        $this->assertDatabaseHas('curriculums', [
            'id' => $id,
            'title' => $payload['title'],
        ]);
    }
}
