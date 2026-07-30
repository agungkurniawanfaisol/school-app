<?php

namespace Tests\Feature\Admin;

use App\Mail\Pmb\PmbCustomMail;
use App\Mail\Pmb\PmbRegistrationAcceptedMail;
use App\Mail\Pmb\PmbRegistrationSubmittedMail;
use App\Models\Media;
use App\Models\PmbEmailLog;
use App\Models\PmbRegistration;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PmbEmailTest extends TestCase
{
    public function test_submit_queues_submitted_email_to_parent_email(): void
    {
        Mail::fake();
        Storage::fake('public');

        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'draft',
            'parent_email' => 'orangtua@example.com',
        ]);

        $media = Media::query()->create([
            'user_id' => $user->id,
            'filename' => 'proof.jpg',
            'original_name' => 'proof.jpg',
            'path' => 'uploads/pmb/proof.jpg',
            'disk' => 'public',
            'mime_type' => 'image/jpeg',
            'size' => 100,
            'collection' => 'pmb',
        ]);

        $this->postJson('/api/v1/pmb/portal/registration/submit', [
            'student_name' => 'Ahmad Fauzi',
            'parent_name' => 'Budi Santoso',
            'parent_phone' => '081234567890',
            'parent_email' => 'orangtua@example.com',
            'grade_applied' => 'SD',
            'payment_info' => [
                'proof_media_id' => $media->id,
            ],
        ])->assertOk();

        $this->assertDatabaseHas('pmb_email_logs', [
            'type' => PmbEmailLog::TYPE_SUBMITTED,
            'recipient_email' => 'orangtua@example.com',
            'status' => PmbEmailLog::STATUS_SENT,
        ]);

        Mail::assertSent(PmbRegistrationSubmittedMail::class, function (PmbRegistrationSubmittedMail $mail) {
            return $mail->hasTo('orangtua@example.com');
        });
    }

    public function test_submit_skips_email_when_parent_email_missing(): void
    {
        Mail::fake();
        Storage::fake('public');

        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'draft',
            'parent_email' => null,
        ]);

        $media = Media::query()->create([
            'user_id' => $user->id,
            'filename' => 'proof.jpg',
            'original_name' => 'proof.jpg',
            'path' => 'uploads/pmb/proof.jpg',
            'disk' => 'public',
            'mime_type' => 'image/jpeg',
            'size' => 100,
            'collection' => 'pmb',
        ]);

        $this->postJson('/api/v1/pmb/portal/registration/submit', [
            'student_name' => 'Ahmad Fauzi',
            'parent_name' => 'Budi Santoso',
            'parent_phone' => '081234567890',
            'grade_applied' => 'SD',
            'payment_info' => [
                'proof_media_id' => $media->id,
            ],
        ])->assertOk();

        Mail::assertNothingSent();

        $this->assertDatabaseHas('pmb_email_logs', [
            'type' => PmbEmailLog::TYPE_SUBMITTED,
            'status' => PmbEmailLog::STATUS_SKIPPED,
        ]);
    }

    public function test_accepted_status_queues_accepted_email_once(): void
    {
        Mail::fake();

        $school = School::factory()->create();
        $admin = User::factory()->adminPmb()->create();
        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'status' => 'awaiting_verification',
            'parent_email' => 'diterima@example.com',
        ]);

        Sanctum::actingAs($admin);

        $this->patchJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid, [
            'status' => 'accepted',
        ])->assertOk();

        Mail::assertSent(PmbRegistrationAcceptedMail::class, function (PmbRegistrationAcceptedMail $mail) {
            return $mail->hasTo('diterima@example.com');
        });

        Mail::fake();

        $this->patchJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid, [
            'notes' => 'Catatan admin',
        ])->assertOk();

        Mail::assertNothingSent();
    }

    public function test_admin_can_send_custom_email_to_selected_registrations(): void
    {
        Mail::fake();

        $school = School::factory()->create();
        $admin = User::factory()->adminPmb()->create();
        $first = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'parent_email' => 'satu@example.com',
            'student_name' => 'Anak Satu',
        ]);
        $second = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'parent_email' => 'dua@example.com',
            'student_name' => 'Anak Dua',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson('/api/admin/pmb-emails/send', [
            'registration_uuids' => [$first->uuid, $second->uuid],
            'subject' => 'Pengumuman PMB',
            'body' => 'Halo {student_name}, nomor {registration_number}.',
        ])
            ->assertOk()
            ->assertJsonPath('data.queued', 2);

        Mail::assertSent(PmbCustomMail::class, 2);
    }

    public function test_admin_can_broadcast_email_with_status_filter(): void
    {
        Mail::fake();

        $school = School::factory()->create();
        $admin = User::factory()->adminPmb()->create();
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'status' => 'accepted',
            'parent_email' => 'accepted@example.com',
        ]);
        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'status' => 'draft',
            'parent_email' => 'draft@example.com',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson('/api/admin/pmb-emails/broadcast', [
            'status' => 'accepted',
            'subject' => 'Info diterima',
            'body' => 'Selamat diterima.',
        ])
            ->assertOk()
            ->assertJsonPath('data.queued', 1);

        Mail::assertSent(PmbCustomMail::class, function (PmbCustomMail $mail) {
            return $mail->hasTo('accepted@example.com');
        });
    }

    public function test_guest_cannot_send_pmb_email(): void
    {
        $this->postJson('/api/admin/pmb-emails/send', [
            'registration_uuids' => ['00000000-0000-0000-0000-000000000001'],
            'subject' => 'Test',
            'body' => 'Test',
        ])->assertUnauthorized();
    }
}
