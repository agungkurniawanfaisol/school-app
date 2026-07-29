<?php

namespace Tests\Feature\Admin;

use App\Models\AcademicYear;
use App\Models\PmbFee;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class PmbFeeAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'pmb-fees';

    private function validPayload(?int $schoolId = null, ?int $yearId = null): array
    {
        $school = $schoolId ? null : $this->createSchool();
        $resolvedSchoolId = $schoolId ?? $school->id;
        $year = $yearId
            ? AcademicYear::query()->findOrFail($yearId)
            : AcademicYear::factory()->for(
                \App\Models\School::query()->findOrFail($resolvedSchoolId)
            )->create(['label' => '2026/2027']);

        return [
            'school_id' => $resolvedSchoolId,
            'academic_year_id' => $year->id,
            'amount' => 350000,
            'notes' => 'Biaya pendaftaran',
            'is_active' => true,
        ];
    }

    public function test_guest_cannot_access(): void
    {
        $this->assertAdminGuestCannotAccess(self::RESOURCE);
    }

    public function test_admin_pmb_can_store_and_activate_single_fee(): void
    {
        $school = $this->createSchool();
        $yearA = AcademicYear::factory()->for($school)->create(['label' => '2025/2026']);
        $yearB = AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);

        PmbFee::factory()->create([
            'school_id' => $school->id,
            'academic_year_id' => $yearA->id,
            'amount' => 300000,
            'is_active' => true,
        ]);

        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), [
            'school_id' => $school->id,
            'academic_year_id' => $yearB->id,
            'amount' => 350000,
            'notes' => 'TA baru',
            'is_active' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('data.amount', 350000)
            ->assertJsonPath('data.amount_formatted', 'Rp 350.000')
            ->assertJsonPath('data.is_active', true);

        $this->assertDatabaseHas('pmb_fees', [
            'academic_year_id' => $yearB->id,
            'is_active' => true,
            'amount' => 350000,
        ]);
        $this->assertDatabaseHas('pmb_fees', [
            'academic_year_id' => $yearA->id,
            'is_active' => false,
        ]);
        $this->assertDatabaseHas('settings', [
            'school_id' => $school->id,
            'group' => 'pmb',
            'key' => 'pmb_fee',
            'value' => 'Rp 350.000',
        ]);
    }

    public function test_cannot_create_duplicate_fee_for_same_year(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->create(['label' => '2026/2027']);
        PmbFee::factory()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 300000,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), [
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 350000,
            'is_active' => false,
        ])->assertUnprocessable();
    }

    public function test_cannot_delete_active_fee(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->create(['label' => '2026/2027']);
        $fee = PmbFee::factory()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 350000,
            'is_active' => true,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->deleteJson($this->adminUrl(self::RESOURCE.'/'.$fee->id))
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Biaya aktif tidak dapat dihapus. Aktifkan biaya lain terlebih dahulu.');
    }

    public function test_admin_can_destroy_inactive_fee(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->create(['label' => '2025/2026']);
        $fee = PmbFee::factory()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 300000,
            'is_active' => false,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->deleteJson($this->adminUrl(self::RESOURCE.'/'.$fee->id))
            ->assertOk();

        $this->assertSoftDeleted('pmb_fees', ['id' => $fee->id]);
    }

    public function test_public_active_fee_endpoint(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);
        PmbFee::factory()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 375000,
            'is_active' => true,
        ]);

        $this->getJson('/api/v1/pmb/fees/active?school_id='.$school->id)
            ->assertOk()
            ->assertJsonPath('data.amount', 375000)
            ->assertJsonPath('data.amount_formatted', 'Rp 375.000');
    }
}
