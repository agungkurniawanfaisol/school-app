<?php

namespace Tests\Feature\Api;

use App\Models\PmbRegistration;
use App\Models\PmbRegistrationEvent;
use App\Models\PmbRegistrationMessage;
use App\Models\User;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PmbPortalNotificationsTest extends TestCase
{
    public function test_guest_cannot_list_notifications(): void
    {
        $this->getJson('/api/v1/pmb/portal/notifications')->assertUnauthorized();
    }

    public function test_pendaftar_sees_unread_admin_message_and_event(): void
    {
        $school = $this->createSchool();
        $pendaftar = User::factory()->pendaftar()->create();
        $admin = User::factory()->adminPmb()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => PmbRegistration::STATUS_AWAITING_VERIFICATION,
            'notifications_seen_at' => null,
        ]);

        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $admin->id,
            'body' => 'Silakan lengkapi dokumen.',
            'read_at' => null,
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $registration->id,
            'actor_user_id' => $admin->id,
            'type' => 'payment_verified',
            'message' => 'Bukti pembayaran diverifikasi.',
            'created_at' => now(),
        ]);

        // Pendaftar's own message should not count as unread notification.
        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $pendaftar->id,
            'body' => 'Baik, saya perbaiki.',
            'read_at' => null,
        ]);

        Sanctum::actingAs($pendaftar);

        $this->getJson('/api/v1/pmb/portal/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 2)
            ->assertJsonCount(2, 'data.items');
    }

    public function test_mark_all_read_clears_unread(): void
    {
        $school = $this->createSchool();
        $pendaftar = User::factory()->pendaftar()->create();
        $admin = User::factory()->admin()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => PmbRegistration::STATUS_NEEDS_REVISION,
            'notifications_seen_at' => Carbon::now()->subDay(),
        ]);

        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $admin->id,
            'body' => 'Perbaiki alamat.',
            'read_at' => null,
            'created_at' => now(),
        ]);

        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $registration->id,
            'actor_user_id' => $admin->id,
            'type' => 'status_changed',
            'message' => 'Status diubah menjadi Perlu perbaikan.',
            'created_at' => now(),
        ]);

        Sanctum::actingAs($pendaftar);

        $this->postJson('/api/v1/pmb/portal/notifications/read', ['all' => true])
            ->assertOk()
            ->assertJsonPath('data.unread_count', 0);

        $this->getJson('/api/v1/pmb/portal/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 0);

        $this->assertNotNull($registration->fresh()->notifications_seen_at);
        $this->assertNotNull(
            PmbRegistrationMessage::query()
                ->where('pmb_registration_id', $registration->id)
                ->where('user_id', $admin->id)
                ->value('read_at')
        );
    }

    public function test_other_pendaftar_does_not_see_foreign_notifications(): void
    {
        $school = $this->createSchool();
        $owner = User::factory()->pendaftar()->create();
        $other = User::factory()->pendaftar()->create();
        $admin = User::factory()->adminPmb()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $owner->id,
        ]);

        PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $admin->id,
            'body' => 'Rahasia',
        ]);

        Sanctum::actingAs($other);

        $this->getJson('/api/v1/pmb/portal/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 0)
            ->assertJsonCount(0, 'data.items');
    }
}
