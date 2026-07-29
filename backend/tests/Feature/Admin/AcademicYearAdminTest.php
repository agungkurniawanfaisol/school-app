<?php

namespace Tests\Feature\Admin;

use App\Models\AcademicYear;
use App\Models\PmbRegistration;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class AcademicYearAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'academic-years';

    private function validPayload(): array
    {
        return [
            'school_id' => $this->createSchool()->id,
            'label' => '2026/2027',
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

    public function test_admin_pmb_can_index(): void
    {
        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->getJson($this->adminUrl(self::RESOURCE))
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_admin_pmb_cannot_create(): void
    {
        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload())
            ->assertForbidden();
    }

    public function test_store_validation_fails(): void
    {
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], [
            'school_id',
            'label',
        ]);
    }

    public function test_admin_can_store_and_activate_single_year(): void
    {
        $school = $this->createSchool();
        AcademicYear::factory()->for($school)->active()->create(['label' => '2024/2025']);

        $this->actingAsAdmin()
            ->postJson($this->adminUrl(self::RESOURCE), [
                'school_id' => $school->id,
                'label' => '2026/2027',
                'is_active' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('data.label', '2026/2027')
            ->assertJsonPath('data.is_active', true);

        $this->assertDatabaseHas('academic_years', [
            'school_id' => $school->id,
            'label' => '2026/2027',
            'is_active' => true,
        ]);
        $this->assertDatabaseHas('academic_years', [
            'school_id' => $school->id,
            'label' => '2024/2025',
            'is_active' => false,
        ]);
    }

    public function test_admin_can_update(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminUpdate(self::RESOURCE, $id, ['label' => '2027/2028', 'is_active' => true]);
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }

    public function test_pmb_registrations_can_filter_by_academic_year(): void
    {
        $school = $this->createSchool();
        AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);

        PmbRegistration::factory()->for($school)->create([
            'student_name' => 'Siswa Lama',
            'academic_year' => '2025/2026',
            'registration_number' => 'PMB-20250101-AAAAAA',
        ]);
        PmbRegistration::factory()->for($school)->create([
            'student_name' => 'Siswa Baru',
            'academic_year' => '2026/2027',
            'registration_number' => 'PMB-20260101-BBBBBB',
        ]);

        $this->actingAsAdmin()
            ->getJson('/api/admin/pmb-registrations?academic_year=2026/2027')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.student_name', 'Siswa Baru');
    }
}
