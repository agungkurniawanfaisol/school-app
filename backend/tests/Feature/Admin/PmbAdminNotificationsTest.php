<?php

namespace Tests\Feature\Admin;

use App\Models\PmbRegistration;
use App\Models\PmbRegistrationEvent;
use App\Models\PmbRegistrationMessage;
use App\Models\User;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PmbAdminNotificationsTest extends TestCase
{
    public function test_guest_cannot_list_admin_notifications(): void
    {
        $this->getJson('/api/admin/pmb-registrations/notifications')->assertUnauthorized();
    }

    public function test_guru_cannot_list_admin_notifications(): void
    {
        Sanctum::actingAs(User::factory()->guru()->create());

        $this->getJson('/api/admin/pmb-registrations/notifications')->assertForbidden();
    }

    public function test_admin_sees_unread_submit_correction_and_pendaftar_message(): void
    {
        $school = $this->createSchool();
        $pendaftar = User::factory()->pendaftar()->create();
        $admin = User::factory()->adminPmb()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
            'admin_notifications_seen_at' => null,
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $registration->id,
            'actor_user_id' => $pendaftar->id,
            'type' => 'submitted',
            'message' => 'Pendaftaran dikirim; menunggu verifikasi.',
            'created_at' => now(),
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $registration->id,
            'actor_user_id' => $pendaftar->id,
            'type' => 'correction_submitted',
            'message' => 'Pendaftar mengirim perbaikan data/bukti pembayaran.',
            'created_at' => now()->addSecond(),
        ]);

        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $pendaftar->id,
            'body' => 'Sudah saya perbaiki.',
            'admin_read_at' => null,
        ]);

        // Admin's own message should not count as unread for admin.
        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $admin->id,
            'body' => 'Tolong lengkapi KK.',
            'admin_read_at' => null,
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/pmb-registrations/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 3)
            ->assertJsonCount(3, 'data.items');
    }

    public function test_mark_all_read_clears_admin_unread(): void
    {
        $school = $this->createSchool();
        $pendaftar = User::factory()->pendaftar()->create();
        $admin = User::factory()->admin()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
            'admin_notifications_seen_at' => Carbon::now()->subDay(),
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $registration->id,
            'actor_user_id' => $pendaftar->id,
            'type' => 'submitted',
            'message' => 'Pendaftaran dikirim.',
            'created_at' => now(),
        ]);

        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $pendaftar->id,
            'body' => 'Halo admin.',
            'admin_read_at' => null,
            'created_at' => now(),
        ]);

        Sanctum::actingAs($admin);

        $this->postJson('/api/admin/pmb-registrations/notifications/read', ['all' => true])
            ->assertOk()
            ->assertJsonPath('data.unread_count', 0);

        $this->assertNotNull($registration->fresh()->admin_notifications_seen_at);
        $this->assertNotNull(
            PmbRegistrationMessage::query()
                ->where('pmb_registration_id', $registration->id)
                ->where('user_id', $pendaftar->id)
                ->value('admin_read_at')
        );
    }

    public function test_show_by_uuid_marks_registration_notifications_read(): void
    {
        $school = $this->createSchool();
        $pendaftar = User::factory()->pendaftar()->create();
        $admin = User::factory()->adminPmb()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
            'admin_notifications_seen_at' => null,
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $registration->id,
            'actor_user_id' => $pendaftar->id,
            'type' => 'submitted',
            'message' => 'Pendaftaran dikirim.',
            'created_at' => now(),
        ]);

        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $pendaftar->id,
            'body' => 'Ada pertanyaan.',
            'admin_read_at' => null,
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid)
            ->assertOk();

        $this->assertNotNull($registration->fresh()->admin_notifications_seen_at);
        $this->assertNotNull(
            PmbRegistrationMessage::query()
                ->where('pmb_registration_id', $registration->id)
                ->where('user_id', $pendaftar->id)
                ->value('admin_read_at')
        );

        $this->getJson('/api/admin/pmb-registrations/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 0);
    }

    public function test_list_includes_has_admin_unread_flag(): void
    {
        $school = $this->createSchool();
        $pendaftar = User::factory()->pendaftar()->create();
        $admin = User::factory()->admin()->create();

        $unread = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
            'admin_notifications_seen_at' => null,
            'student_name' => 'Unread Student',
        ]);

        $read = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
            'admin_notifications_seen_at' => now(),
            'student_name' => 'Read Student',
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $unread->id,
            'actor_user_id' => $pendaftar->id,
            'type' => 'submitted',
            'message' => 'Pendaftaran dikirim.',
            'created_at' => now(),
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $read->id,
            'actor_user_id' => $pendaftar->id,
            'type' => 'submitted',
            'message' => 'Pendaftaran dikirim.',
            'created_at' => now()->subHour(),
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/pmb-registrations?per_page=50')->assertOk();

        $byUuid = collect($response->json('data'))->keyBy('uuid');
        $this->assertTrue((bool) $byUuid[$unread->uuid]['has_admin_unread']);
        $this->assertFalse((bool) $byUuid[$read->uuid]['has_admin_unread']);
    }
}
