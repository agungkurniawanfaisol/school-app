<?php

namespace Tests\Feature\Admin;

use App\Models\AcademicYear;
use App\Models\PmbFee;
use App\Models\PmbProgram;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class PmbFeeAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'pmb-fees';

    private function programId(int $schoolId, string $code = 'reguler', string $name = 'Reguler'): int
    {
        $program = PmbProgram::query()
            ->where('school_id', $schoolId)
            ->where('code', $code)
            ->first();

        if ($program) {
            return (int) $program->id;
        }

        return (int) PmbProgram::factory()->create([
            'school_id' => $schoolId,
            'code' => $code,
            'name' => $name,
            'is_active' => true,
        ])->id;
    }

    private function validPayload(?int $schoolId = null, ?int $yearId = null, array $overrides = []): array
    {
        $school = $schoolId ? null : $this->createSchool();
        $resolvedSchoolId = $schoolId ?? $school->id;
        $year = $yearId
            ? AcademicYear::query()->findOrFail($yearId)
            : AcademicYear::factory()->for(
                \App\Models\School::query()->findOrFail($resolvedSchoolId)
            )->create(['label' => '2026/2027']);

        $code = $overrides['program'] ?? 'reguler';
        $programName = $code === 'icp' ? 'ICP' : 'Reguler';
        unset($overrides['program']);

        return array_merge([
            'school_id' => $resolvedSchoolId,
            'academic_year_id' => $year->id,
            'name' => 'SD Reguler',
            'jenjang' => 'sd',
            'pmb_program_id' => $this->programId($resolvedSchoolId, $code, $programName),
            'amount' => 350000,
            'bank_name' => 'BSI',
            'account_number' => '1234567890',
            'account_holder' => 'Yayasan Nurul Hikmah',
            'notes' => 'Biaya pendaftaran',
            'is_active' => true,
        ], $overrides);
    }

    public function test_guest_cannot_access(): void
    {
        $this->assertAdminGuestCannotAccess(self::RESOURCE);
    }

    public function test_admin_pmb_can_store_multiple_active_fees(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);

        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload($school->id, $year->id, [
            'name' => 'SD Reguler',
            'jenjang' => 'sd',
            'program' => 'reguler',
            'amount' => 350000,
        ]))
            ->assertCreated()
            ->assertJsonPath('data.amount', 350000)
            ->assertJsonPath('data.jenjang', 'sd')
            ->assertJsonPath('data.program', 'reguler')
            ->assertJsonPath('data.program_name', 'Reguler')
            ->assertJsonPath('data.bank_name', 'BSI')
            ->assertJsonPath('data.is_active', true);

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload($school->id, $year->id, [
            'name' => 'SD ICP',
            'jenjang' => 'sd',
            'program' => 'icp',
            'amount' => 450000,
        ]))
            ->assertCreated()
            ->assertJsonPath('data.program', 'icp')
            ->assertJsonPath('data.program_name', 'ICP')
            ->assertJsonPath('data.is_active', true);

        $this->assertDatabaseHas('pmb_fees', [
            'academic_year_id' => $year->id,
            'jenjang' => 'sd',
            'program' => 'reguler',
            'is_active' => true,
        ]);
        $this->assertDatabaseHas('pmb_fees', [
            'academic_year_id' => $year->id,
            'jenjang' => 'sd',
            'program' => 'icp',
            'is_active' => true,
        ]);
    }

    public function test_admin_pmb_can_store_kb_fee(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);

        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload($school->id, $year->id, [
            'name' => 'KB Reguler',
            'jenjang' => 'kb',
            'program' => 'reguler',
            'amount' => 200000,
        ]))
            ->assertCreated()
            ->assertJsonPath('data.jenjang', 'kb')
            ->assertJsonPath('data.name', 'KB Reguler');

        $this->assertDatabaseHas('pmb_fees', [
            'academic_year_id' => $year->id,
            'jenjang' => 'kb',
            'program' => 'reguler',
            'amount' => 200000,
        ]);
    }

    public function test_cannot_create_duplicate_fee_for_same_year_jenjang_program(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->create(['label' => '2026/2027']);
        $fee = PmbFee::factory()->sdReguler()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 300000,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload($school->id, $year->id, [
            'jenjang' => 'sd',
            'pmb_program_id' => $fee->pmb_program_id,
            'is_active' => false,
        ]))->assertUnprocessable();
    }

    public function test_admin_can_destroy_active_fee(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->create(['label' => '2026/2027']);
        $fee = PmbFee::factory()->sdReguler()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 350000,
            'is_active' => true,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->deleteJson($this->adminUrl(self::RESOURCE.'/'.$fee->id))
            ->assertOk();

        $this->assertSoftDeleted('pmb_fees', ['id' => $fee->id]);
    }

    public function test_admin_can_recreate_fee_after_soft_delete(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->create(['label' => '2026/2027']);
        $fee = PmbFee::factory()->sdReguler()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 300000,
            'is_active' => false,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->deleteJson($this->adminUrl(self::RESOURCE.'/'.$fee->id))
            ->assertOk();

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload($school->id, $year->id, [
            'jenjang' => 'sd',
            'program' => 'reguler',
            'amount' => 350000,
            'notes' => 'BSI',
            'is_active' => true,
        ]))
            ->assertCreated()
            ->assertJsonPath('data.amount', 350000)
            ->assertJsonPath('data.is_active', true);
    }

    public function test_admin_can_destroy_inactive_fee(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->create(['label' => '2025/2026']);
        $fee = PmbFee::factory()->tkReguler()->create([
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

    public function test_public_lists_active_fees(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);
        PmbFee::factory()->sdReguler()->active()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 375000,
        ]);
        PmbFee::factory()->sdIcp()->active()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 450000,
        ]);
        PmbFee::factory()->tkReguler()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 200000,
            'is_active' => false,
        ]);

        $this->getJson('/api/v1/pmb/fees?school_id='.$school->id)
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['amount' => 375000, 'program' => 'reguler'])
            ->assertJsonFragment(['amount' => 450000, 'program' => 'icp'])
            ->assertJsonFragment(['bank_name' => 'Bank Syariah Indonesia (BSI)']);
    }

    public function test_public_active_fee_endpoint_still_works(): void
    {
        $school = $this->createSchool();
        $year = AcademicYear::factory()->for($school)->active()->create(['label' => '2026/2027']);
        PmbFee::factory()->sdReguler()->active()->create([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
            'amount' => 375000,
        ]);

        $this->getJson('/api/v1/pmb/fees/active?school_id='.$school->id)
            ->assertOk()
            ->assertJsonPath('data.amount', 375000)
            ->assertJsonPath('data.amount_formatted', 'Rp 375.000');
    }
}
