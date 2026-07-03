<?php

namespace Tests\Feature\Admin;

use App\Models\PmbRegistration;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class PmbDocumentAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'pmb-documents';

    private function validPayload(): array
    {
        return [
            'pmb_registration_id' => PmbRegistration::factory()->create()->id,
            'document_type' => 'kk',
            'file_path' => '/storage/pmb/kk.pdf',
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
            'pmb_registration_id',
            'document_type',
            'file_path',
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
        $this->assertAdminUpdate(self::RESOURCE, $id, ['document_type' => 'akte']);
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }
}
