<?php

namespace Tests\Feature\Admin;

use App\Models\PmbRegistration;
use App\Models\User;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class PmbRegistrationAnalyticsTest extends TestCase
{
    use AssertsAdminCrud;

    public function test_guest_cannot_access_stats(): void
    {
        $this->getJson($this->adminUrl('pmb-registrations/stats'))
            ->assertUnauthorized();
    }

    public function test_guest_cannot_access_export(): void
    {
        $this->getJson($this->adminUrl('pmb-registrations/export'))
            ->assertUnauthorized();
    }

    public function test_admin_can_get_stats_with_filters(): void
    {
        $school = $this->createSchool();
        $otherSchool = $this->createSchool();

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'academic_year' => '2026/2027',
            'status' => PmbRegistration::STATUS_ACCEPTED,
            'grade_applied' => 'VII',
            'gender' => 'L',
            'previous_school' => 'SD Harapan',
            'student_name' => 'Ahmad Stats',
            'created_at' => Carbon::create(2026, 7, 10, 12),
        ]);
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'academic_year' => '2026/2027',
            'status' => PmbRegistration::STATUS_NEEDS_REVISION,
            'grade_applied' => 'VII',
            'gender' => 'P',
            'previous_school' => 'SD Harapan',
            'created_at' => Carbon::create(2026, 7, 15, 12),
        ]);
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'academic_year' => '2025/2026',
            'status' => PmbRegistration::STATUS_ACCEPTED,
            'grade_applied' => 'VIII',
            'gender' => 'L',
            'previous_school' => 'SD Lain',
        ]);
        PmbRegistration::factory()->create([
            'school_id' => $otherSchool->id,
            'academic_year' => '2026/2027',
            'status' => PmbRegistration::STATUS_ACCEPTED,
            'grade_applied' => 'VII',
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $response = $this->getJson($this->adminUrl('pmb-registrations/stats').'?academic_year=2026/2027&school_id='.$school->id)
            ->assertOk()
            ->assertJsonPath('data.totals.all', 2)
            ->assertJsonPath('data.totals.by_status.accepted', 1)
            ->assertJsonPath('data.totals.by_status.needs_revision', 1);

        $byGrade = collect($response->json('data.by_grade'));
        $this->assertSame(2, (int) $byGrade->firstWhere('grade', 'VII')['count']);

        $byGender = collect($response->json('data.by_gender'));
        $this->assertSame(1, (int) $byGender->firstWhere('gender', 'L')['count']);
        $this->assertSame(1, (int) $byGender->firstWhere('gender', 'P')['count']);

        $byMonth = collect($response->json('data.by_month'));
        $july = $byMonth->first(fn (array $row): bool => (int) $row['year'] === 2026 && (int) $row['month'] === 7);
        $this->assertNotNull($july);
        $this->assertSame(2, (int) $july['count']);

        $schools = collect($response->json('data.top_previous_schools'));
        $this->assertSame(2, (int) $schools->firstWhere('name', 'SD Harapan')['count']);
    }

    public function test_stats_respect_search_filter(): void
    {
        $school = $this->createSchool();
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'academic_year' => '2026/2027',
            'student_name' => 'Budi Unique',
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
        ]);
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'academic_year' => '2026/2027',
            'student_name' => 'Siti Other',
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson($this->adminUrl('pmb-registrations/stats').'?academic_year=2026/2027&school_id='.$school->id.'&search=Budi')
            ->assertOk()
            ->assertJsonPath('data.totals.all', 1);
    }

    public function test_admin_can_sort_list_by_student_name(): void
    {
        $school = $this->createSchool();
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'student_name' => 'Zainab',
            'academic_year' => '2026/2027',
        ]);
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'student_name' => 'Ahmad',
            'academic_year' => '2026/2027',
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $names = collect(
            $this->getJson($this->adminUrl('pmb-registrations').'?school_id='.$school->id.'&sort_by=student_name&sort_dir=asc')
                ->assertOk()
                ->json('data')
        )->pluck('student_name')->all();

        $this->assertSame(['Ahmad', 'Zainab'], $names);
    }

    public function test_admin_can_export_csv_with_filters(): void
    {
        $school = $this->createSchool();
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'academic_year' => '2026/2027',
            'student_name' => 'Export Target',
            'status' => PmbRegistration::STATUS_ACCEPTED,
            'grade_applied' => 'VII',
            'gender' => 'L',
            'parent_name' => 'Orang Tua',
            'parent_phone' => '081234567890',
            'parent_email' => 'ortu@example.com',
            'previous_school' => 'SD Contoh',
            'loa_issued_at' => now(),
        ]);
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'academic_year' => '2025/2026',
            'student_name' => 'Other Year',
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $response = $this->get($this->adminUrl('pmb-registrations/export').'?academic_year=2026/2027&school_id='.$school->id)
            ->assertOk();

        $this->assertStringContainsString('text/csv', (string) $response->headers->get('content-type'));
        $csv = $response->streamedContent();
        $this->assertStringContainsString('Export Target', $csv);
        $this->assertStringNotContainsString('Other Year', $csv);
        $this->assertStringContainsString('registration_number', $csv);
        $this->assertStringContainsString('student_name', $csv);
        $this->assertStringNotContainsString(',id,', ','.$csv);
    }

    public function test_export_rejects_when_over_cap(): void
    {
        config(['pmb.export_max_rows' => 2]);

        $school = $this->createSchool();
        PmbRegistration::factory()->count(3)->create([
            'school_id' => $school->id,
            'academic_year' => '2026/2027',
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson($this->adminUrl('pmb-registrations/export').'?academic_year=2026/2027&school_id='.$school->id)
            ->assertStatus(422)
            ->assertJsonFragment(['message' => 'Jumlah data melebihi batas ekspor (2 baris).']);
    }
}
