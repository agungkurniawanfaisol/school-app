<?php

namespace Tests\Feature\Admin;

use App\Models\PmbFee;
use App\Models\PmbProgram;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class PmbProgramAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'pmb-programs';

    private function validPayload(?int $schoolId = null, array $overrides = []): array
    {
        return array_merge([
            'school_id' => $schoolId ?? $this->createSchool()->id,
            'code' => 'tahfidz',
            'name' => 'Tahfidz',
            'sort_order' => 10,
            'is_active' => true,
        ], $overrides);
    }

    public function test_guest_cannot_access(): void
    {
        $this->assertAdminGuestCannotAccess(self::RESOURCE);
    }

    public function test_admin_pmb_can_store_program(): void
    {
        $school = $this->createSchool();
        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload($school->id))
            ->assertCreated()
            ->assertJsonPath('data.code', 'tahfidz')
            ->assertJsonPath('data.name', 'Tahfidz')
            ->assertJsonPath('data.is_active', true);

        $this->assertDatabaseHas('pmb_programs', [
            'school_id' => $school->id,
            'code' => 'tahfidz',
            'name' => 'Tahfidz',
        ]);
    }

    public function test_cannot_change_code_on_update(): void
    {
        $school = $this->createSchool();
        $program = PmbProgram::factory()->create([
            'school_id' => $school->id,
            'code' => 'icp',
            'name' => 'ICP',
        ]);

        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->putJson($this->adminUrl(self::RESOURCE.'/'.$program->id), [
            'school_id' => $school->id,
            'code' => 'icp-plus',
            'name' => 'ICP Plus',
            'is_active' => true,
        ])
            ->assertOk()
            ->assertJsonPath('data.code', 'icp')
            ->assertJsonPath('data.name', 'ICP Plus');

        $this->assertDatabaseHas('pmb_programs', [
            'id' => $program->id,
            'code' => 'icp',
            'name' => 'ICP Plus',
        ]);
    }

    public function test_duplicate_code_per_school_rejected(): void
    {
        $school = $this->createSchool();
        PmbProgram::factory()->create([
            'school_id' => $school->id,
            'code' => 'reguler',
            'name' => 'Reguler',
        ]);

        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload($school->id, [
            'code' => 'reguler',
            'name' => 'Reguler 2',
        ]))->assertUnprocessable();
    }

    public function test_index_can_filter_active_only(): void
    {
        $school = $this->createSchool();
        PmbProgram::factory()->create([
            'school_id' => $school->id,
            'code' => 'reguler',
            'name' => 'Reguler',
            'is_active' => true,
        ]);
        PmbProgram::factory()->create([
            'school_id' => $school->id,
            'code' => 'legacy',
            'name' => 'Legacy',
            'is_active' => false,
        ]);

        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->getJson($this->adminUrl(self::RESOURCE).'?is_active=1&per_page=50')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'reguler');
    }

    public function test_admin_can_soft_delete_program_with_fees(): void
    {
        $school = $this->createSchool();
        $program = PmbProgram::factory()->create([
            'school_id' => $school->id,
            'code' => 'reguler',
            'name' => 'Reguler',
        ]);
        PmbFee::factory()->create([
            'school_id' => $school->id,
            'pmb_program_id' => $program->id,
            'program' => 'reguler',
        ]);

        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->deleteJson($this->adminUrl(self::RESOURCE.'/'.$program->id))
            ->assertOk();

        $this->assertSoftDeleted('pmb_programs', ['id' => $program->id]);
    }
}
