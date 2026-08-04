<?php

namespace Tests\Feature\Api;

use App\Models\AcademicYear;
use App\Models\Media;
use App\Models\PmbFee;
use App\Models\PmbRegistration;
use App\Models\PmbRegistrationMessage;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PmbPortalApiTest extends TestCase
{
    private function createActiveFee(School $school, array $overrides = []): PmbFee
    {
        $year = AcademicYear::factory()->for($school)->active()->create();

        return PmbFee::factory()->sdReguler()->active()->create(array_merge([
            'school_id' => $school->id,
            'academic_year_id' => $year->id,
        ], $overrides));
    }

    public function test_guest_cannot_access_portal(): void
    {
        $this->getJson('/api/v1/pmb/portal/registration')->assertUnauthorized();
    }

    public function test_pendaftar_can_login_with_password(): void
    {
        $user = User::factory()->pendaftar()->create([
            'email' => 'login-pendaftar@test.sch.id',
            'password' => 'password',
        ]);

        $this->postJson('/api/v1/pmb/portal/login', [
            'email' => 'login-pendaftar@test.sch.id',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.role', 'pendaftar')
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_admin_cannot_login_via_portal(): void
    {
        User::factory()->admin()->create([
            'email' => 'admin-portal-block@test.sch.id',
            'password' => 'password',
        ]);

        $this->postJson('/api/v1/pmb/portal/login', [
            'email' => 'admin-portal-block@test.sch.id',
            'password' => 'password',
        ])->assertForbidden();
    }

    public function test_admin_cannot_access_portal(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson('/api/v1/pmb/portal/registration')->assertForbidden();
    }

    public function test_portal_registration_requires_school_data(): void
    {
        Sanctum::actingAs(User::factory()->pendaftar()->create());

        $this->getJson('/api/v1/pmb/portal/registration')
            ->assertStatus(503)
            ->assertJsonPath('message', 'Data sekolah belum tersedia. Jalankan migrasi/seed database terlebih dahulu.');
    }

    public function test_pendaftar_can_create_and_save_draft(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/pmb/portal/registration?school_id='.$school->id)
            ->assertOk()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.uuid', fn ($uuid) => is_string($uuid) && $uuid !== '');

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'student_name' => 'Ahmad Fauzi',
            'parent_name' => 'Budi',
            'parent_phone' => '081234567890',
            'grade_applied' => 'SD',
            'current_step' => 2,
        ])
            ->assertOk()
            ->assertJsonPath('data.student_name', 'Ahmad Fauzi')
            ->assertJsonPath('data.current_step', 2);

        $this->assertDatabaseHas('pmb_registrations', [
            'user_id' => $user->id,
            'student_name' => 'Ahmad Fauzi',
            'status' => 'draft',
        ]);
    }

    public function test_draft_merges_extended_draft_payload(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/pmb/portal/registration?school_id='.$school->id)->assertOk();

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'student_name' => 'Ahmad Fauzi',
            'address' => 'Jl. Merdeka',
            'parent_name' => 'Budi Santoso',
            'parent_phone' => '+6281234567890',
            'parent_email' => 'budi@example.com',
            'draft_payload' => [
                'nickname' => 'Ahmad',
                'contact_phone' => '+6281234567890',
                'relationship_to_child' => 'Anak kandung',
                'child_order' => '1',
                'sibling_count' => '2',
                'father_name' => 'Budi Santoso',
                'mother_name' => 'Siti Aminah',
                'father_phone' => '+6281234567890',
                'mother_phone' => '+6289876543210',
                'email_secondary' => 'siti@example.com',
                'address_rt' => '001',
                'address_rw' => '002',
                'kabupaten' => 'Jakarta Selatan',
                'provinsi' => 'DKI Jakarta',
            ],
            'current_step' => 3,
        ])
            ->assertOk()
            ->assertJsonPath('data.draft_payload.nickname', 'Ahmad')
            ->assertJsonPath('data.draft_payload.father_name', 'Budi Santoso')
            ->assertJsonPath('data.draft_payload.address_rt', '001')
            ->assertJsonPath('data.draft_payload.kabupaten', 'Jakarta Selatan')
            ->assertJsonPath('data.draft_payload.provinsi', 'DKI Jakarta')
            ->assertJsonPath('data.draft_payload.academic_year', fn ($year) => is_string($year) && str_contains($year, '/'));

        $registration = PmbRegistration::query()->where('user_id', $user->id)->first();
        $this->assertNotNull($registration);
        $this->assertSame('Ahmad', $registration->draft_payload['nickname'] ?? null);
        $this->assertArrayHasKey('academic_year', $registration->draft_payload ?? []);
    }

    public function test_draft_requires_relationship_other_when_lainnya(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/pmb/portal/registration?school_id='.$school->id)->assertOk();

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'draft_payload' => [
                'relationship_to_child' => 'Lainnya',
            ],
        ])->assertUnprocessable();

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'draft_payload' => [
                'relationship_to_child' => 'Lainnya',
                'relationship_to_child_other' => 'Anak angkat',
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.draft_payload.relationship_to_child_other', 'Anak angkat');
    }

    public function test_submit_requires_payment_proof(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'draft',
            'student_name' => 'Ahmad',
            'parent_name' => 'Budi',
            'parent_phone' => '081234567890',
            'grade_applied' => 'SD',
        ]);

        $this->postJson('/api/v1/pmb/portal/registration/submit', [
            'student_name' => 'Ahmad',
            'parent_name' => 'Budi',
            'parent_phone' => '081234567890',
            'grade_applied' => 'SD',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['payment_info']);
    }

    public function test_submit_with_proof_sets_awaiting_verification(): void
    {
        Storage::fake('public');
        \Illuminate\Support\Facades\Mail::fake();
        $school = School::factory()->create();
        $fee = $this->createActiveFee($school);
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'draft',
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

        $response = $this->postJson('/api/v1/pmb/portal/registration/submit', [
            'student_name' => 'Ahmad Fauzi',
            'parent_name' => 'Budi Santoso',
            'parent_phone' => '081234567890',
            'grade_applied' => 'SD',
            'pmb_fee_uuid' => $fee->uuid,
            'payment_info' => [
                'proof_media_id' => $media->id,
                'pmb_fee_uuid' => $fee->uuid,
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'awaiting_verification')
            ->assertJsonPath('data.pmb_fee_id', $fee->id)
            ->assertJsonPath('data.payment_info.bank_name', $fee->bank_name);
    }

    public function test_draft_clears_pmb_fee_id_when_uuid_explicitly_null(): void
    {
        $school = School::factory()->create();
        $fee = $this->createActiveFee($school);
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'draft',
            'pmb_fee_id' => $fee->id,
            'payment_info' => ['pmb_fee_uuid' => $fee->uuid],
            'draft_payload' => ['pmb_fee_uuid' => $fee->uuid, 'jenjang' => 'sd', 'program' => 'reguler'],
        ]);

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'pmb_fee_uuid' => null,
            'draft_payload' => [
                'jenjang' => 'tk',
                'program' => null,
                'pmb_fee_uuid' => null,
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.pmb_fee_id', null);

        $this->assertDatabaseHas('pmb_registrations', [
            'user_id' => $user->id,
            'pmb_fee_id' => null,
        ]);
    }

    public function test_draft_keeps_pmb_fee_id_when_fee_uuid_omitted(): void
    {
        $school = School::factory()->create();
        $fee = $this->createActiveFee($school);
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'draft',
            'pmb_fee_id' => $fee->id,
            'payment_info' => ['pmb_fee_uuid' => $fee->uuid],
        ]);

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'draft_payload' => ['nickname' => 'Mad'],
        ])
            ->assertOk()
            ->assertJsonPath('data.pmb_fee_id', $fee->id);
    }

    public function test_pendaftar_can_save_draft_and_submit_correction_while_in_review(): void
    {
        Storage::fake('public');
        $school = School::factory()->create();
        $fee = $this->createActiveFee($school);
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        $oldProof = Media::query()->create([
            'user_id' => $user->id,
            'filename' => 'old.jpg',
            'original_name' => 'old.jpg',
            'path' => 'uploads/pmb/old.jpg',
            'disk' => 'public',
            'mime_type' => 'image/jpeg',
            'size' => 100,
            'collection' => 'pmb',
        ]);
        $newProof = Media::query()->create([
            'user_id' => $user->id,
            'filename' => 'new.jpg',
            'original_name' => 'new.jpg',
            'path' => 'uploads/pmb/new.jpg',
            'disk' => 'public',
            'mime_type' => 'image/jpeg',
            'size' => 120,
            'collection' => 'pmb',
        ]);

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'needs_revision',
            'student_name' => 'Ahmad Lama',
            'parent_name' => 'Budi',
            'parent_phone' => '081234567890',
            'pmb_fee_id' => $fee->id,
            'payment_info' => [
                'proof_media_id' => $oldProof->id,
                'pmb_fee_uuid' => $fee->uuid,
            ],
        ]);

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'student_name' => 'Ahmad Baru',
            'pmb_fee_uuid' => $fee->uuid,
            'draft_payload' => ['nickname' => 'Mad', 'pmb_fee_uuid' => $fee->uuid],
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'needs_revision')
            ->assertJsonPath('data.student_name', 'Ahmad Baru');

        $this->postJson('/api/v1/pmb/portal/registration/correction', [
            'student_name' => 'Ahmad Baru',
            'parent_name' => 'Budi Santoso',
            'parent_phone' => '081234567890',
            'grade_applied' => 'SD',
            'pmb_fee_uuid' => $fee->uuid,
            'payment_info' => [
                'proof_media_id' => $newProof->id,
                'note' => 'Bukti transfer baru',
                'pmb_fee_uuid' => $fee->uuid,
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'awaiting_verification')
            ->assertJsonPath('data.payment_info.proof_media_id', $newProof->id);

        $this->assertDatabaseHas('pmb_registration_events', [
            'pmb_registration_id' => $registration->id,
            'type' => 'correction_submitted',
        ]);
    }

    public function test_correction_rejected_when_not_needs_revision(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => 'awaiting_verification',
            'student_name' => 'Ahmad',
            'parent_name' => 'Budi',
            'parent_phone' => '081234567890',
        ]);

        $this->postJson('/api/v1/pmb/portal/registration/correction', [
            'student_name' => 'Ahmad',
            'parent_name' => 'Budi',
            'parent_phone' => '081234567890',
            'payment_info' => ['proof_media_id' => 1],
        ])->assertUnprocessable();
    }

    public function test_admin_pmb_can_verify_payment(): void
    {
        $school = School::factory()->create();
        $pendaftar = User::factory()->pendaftar()->create();
        $adminPmb = User::factory()->adminPmb()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => 'awaiting_verification',
            'student_name' => 'Ahmad',
            'payment_info' => ['proof_media_id' => 1],
        ]);

        Sanctum::actingAs($adminPmb);

        $this->patchJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid, [
            'verify_payment' => true,
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'awaiting_verification');

        $this->assertDatabaseHas('pmb_registration_events', [
            'pmb_registration_id' => $registration->id,
            'type' => 'payment_verified',
        ]);
    }

    public function test_admin_show_includes_student_photo_and_payment_proof_urls(): void
    {
        $school = School::factory()->create();
        $pendaftar = User::factory()->pendaftar()->create();
        $adminPmb = User::factory()->adminPmb()->create();

        $photo = Media::factory()->create([
            'user_id' => $pendaftar->id,
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/student.jpg',
            'disk' => 'local',
            'original_name' => 'foto.jpg',
        ]);
        $proof = Media::factory()->create([
            'user_id' => $pendaftar->id,
            'collection' => 'pmb',
            'mime_type' => 'image/png',
            'path' => 'uploads/pmb/bukti.png',
            'disk' => 'local',
            'original_name' => 'bukti.png',
        ]);

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => 'awaiting_verification',
            'student_name' => 'Ahmad',
            'draft_payload' => ['student_photo_media_id' => $photo->id],
            'payment_info' => [
                'proof_media_id' => $proof->id,
                'note' => 'Transfer BSI',
                'transferred_at' => '2026-07-28',
            ],
        ]);

        Sanctum::actingAs($adminPmb);

        $response = $this->getJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid);

        $response->assertOk()
            ->assertJsonPath('data.student_photo.uuid', $photo->uuid)
            ->assertJsonPath('data.student_photo.mime_type', 'image/jpeg')
            ->assertJsonPath('data.payment_info.proof_mime_type', 'image/png')
            ->assertJsonPath('data.payment_info.proof_name', 'bukti.png');

        $photoUrl = $response->json('data.student_photo.url');
        $proofUrl = $response->json('data.payment_info.proof_url');
        $this->assertIsString($photoUrl);
        $this->assertIsString($proofUrl);
        $this->assertStringContainsString('/api/v1/pmb/portal/media/'.$photo->uuid, $photoUrl);
        $this->assertStringContainsString('/api/v1/pmb/portal/media/'.$proof->uuid, $proofUrl);
        $this->assertStringContainsString('signature=', $photoUrl);
        $this->assertStringContainsString('signature=', $proofUrl);
    }

    public function test_admin_saving_notes_creates_message_visible_to_pendaftar(): void
    {
        $school = School::factory()->create();
        $pendaftar = User::factory()->pendaftar()->create();
        $adminPmb = User::factory()->adminPmb()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => 'awaiting_verification',
            'student_name' => 'Ahmad',
            'notes' => null,
        ]);

        Sanctum::actingAs($adminPmb);
        $this->patchJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid, [
            'status' => 'needs_revision',
            'notes' => 'Mohon lengkapi dokumen KK.',
        ])
            ->assertOk()
            ->assertJsonPath('data.notes', null)
            ->assertJsonPath('data.status', 'needs_revision');

        $this->assertDatabaseHas('pmb_registration_messages', [
            'pmb_registration_id' => $registration->id,
            'user_id' => $adminPmb->id,
            'body' => 'Mohon lengkapi dokumen KK.',
        ]);
        $this->assertDatabaseHas('pmb_registrations', [
            'id' => $registration->id,
            'notes' => null,
        ]);

        Sanctum::actingAs($pendaftar);
        $this->getJson('/api/v1/pmb/portal/registrations/'.$registration->uuid)
            ->assertOk()
            ->assertJsonPath('data.messages.0.body', 'Mohon lengkapi dokumen KK.');

        // Saving status again with empty notes must not duplicate the message.
        Sanctum::actingAs($adminPmb);
        $this->patchJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid, [
            'status' => 'needs_revision',
            'notes' => null,
        ])->assertOk();

        $this->assertSame(
            1,
            PmbRegistrationMessage::query()
                ->where('pmb_registration_id', $registration->id)
                ->count()
        );
    }

    public function test_admin_pmb_and_pendaftar_can_exchange_messages(): void
    {
        $school = School::factory()->create();
        $pendaftar = User::factory()->pendaftar()->create();
        $adminPmb = User::factory()->adminPmb()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $pendaftar->id,
            'status' => 'awaiting_verification',
            'student_name' => 'Ahmad',
        ]);

        Sanctum::actingAs($adminPmb);
        $this->postJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid.'/messages', [
            'body' => 'Mohon lengkapi dokumen KK.',
        ])->assertCreated();

        $this->assertDatabaseHas('pmb_registrations', [
            'id' => $registration->id,
            'status' => 'awaiting_verification',
        ]);

        Sanctum::actingAs($pendaftar);
        $this->postJson('/api/v1/pmb/portal/registrations/'.$registration->uuid.'/messages', [
            'body' => 'Baik, akan saya unggah.',
        ])->assertCreated();

        $this->getJson('/api/v1/pmb/portal/registrations/'.$registration->uuid)
            ->assertOk()
            ->assertJsonCount(2, 'data.messages');
    }

    public function test_issue_loa_requires_accepted_status(): void
    {
        \Illuminate\Support\Facades\Mail::fake();
        $school = School::factory()->create();
        $adminPmb = User::factory()->adminPmb()->create();
        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'status' => 'needs_revision',
            'student_name' => 'Ahmad',
        ]);

        Sanctum::actingAs($adminPmb);

        $this->patchJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid, [
            'issue_loa' => true,
        ])->assertUnprocessable();

        $this->patchJson('/api/admin/pmb-registrations/by-uuid/'.$registration->uuid, [
            'status' => 'accepted',
            'issue_loa' => true,
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'accepted');

        $this->assertNotNull($registration->fresh()->loa_issued_at);
    }

    public function test_pendaftar_cannot_view_other_registration(): void
    {
        $school = School::factory()->create();
        $owner = User::factory()->pendaftar()->create();
        $other = User::factory()->pendaftar()->create();

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $owner->id,
            'status' => 'awaiting_verification',
            'student_name' => 'Ahmad',
        ]);

        Sanctum::actingAs($other);

        $this->getJson('/api/v1/pmb/portal/registrations/'.$registration->uuid)
            ->assertNotFound();
    }

    public function test_guru_cannot_access_admin_pmb_routes(): void
    {
        Sanctum::actingAs(User::factory()->guru()->create());

        $this->getJson('/api/admin/pmb-registrations')->assertForbidden();
    }

    public function test_admin_pmb_can_index_registrations(): void
    {
        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->getJson('/api/admin/pmb-registrations')->assertOk();
    }

    public function test_portal_upload_accepts_image(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->pendaftar()->create());

        $this->post('/api/v1/pmb/portal/uploads', [
            'file' => UploadedFile::fake()->image('bukti.jpg'),
            'collection' => 'pmb',
            'purpose' => 'payment_proof',
        ])->assertCreated()
            ->assertJsonStructure(['data' => ['id', 'url']]);
    }

    public function test_portal_upload_student_photo_rejects_pdf(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->pendaftar()->create());

        $this->post('/api/v1/pmb/portal/uploads', [
            'file' => UploadedFile::fake()->create('foto.pdf', 100, 'application/pdf'),
            'collection' => 'pmb',
            'purpose' => 'student_photo',
        ])->assertUnprocessable();
    }

    public function test_portal_upload_student_photo_rejects_files_over_one_megabyte(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->pendaftar()->create());

        $this->post('/api/v1/pmb/portal/uploads', [
            'file' => UploadedFile::fake()->image('foto.jpg')->size(1025),
            'collection' => 'pmb',
            'purpose' => 'student_photo',
        ])->assertUnprocessable();

        $this->post('/api/v1/pmb/portal/uploads', [
            'file' => UploadedFile::fake()->image('foto.jpg')->size(512),
            'collection' => 'pmb',
            'purpose' => 'student_photo',
        ])->assertCreated();
    }

    public function test_portal_me_returns_avatar_url_from_student_photo(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        $media = Media::factory()->create([
            'user_id' => $user->id,
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/student.jpg',
            'disk' => 'local',
        ]);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'status' => PmbRegistration::STATUS_DRAFT,
            'draft_payload' => ['student_photo_media_id' => $media->id],
        ]);

        $response = $this->getJson('/api/v1/pmb/portal/me');

        $response->assertOk();
        $avatarUrl = $response->json('data.avatar_url');
        $this->assertIsString($avatarUrl);
        $this->assertStringContainsString('/api/v1/pmb/portal/media/', $avatarUrl);
        $this->assertStringContainsString('signature=', $avatarUrl);
    }

    public function test_portal_draft_rejects_foreign_student_photo_media(): void
    {
        $school = School::factory()->create();
        $owner = User::factory()->pendaftar()->create();
        $other = User::factory()->pendaftar()->create();
        Sanctum::actingAs($owner);

        $foreignMedia = Media::factory()->create([
            'user_id' => $other->id,
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/other.jpg',
        ]);

        $this->getJson('/api/v1/pmb/portal/registration?school_id='.$school->id)->assertOk();

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'draft_payload' => [
                'student_photo_media_id' => $foreignMedia->id,
            ],
        ])->assertUnprocessable();
    }

    public function test_portal_draft_rejects_foreign_proof_media(): void
    {
        $school = School::factory()->create();
        $owner = User::factory()->pendaftar()->create();
        $other = User::factory()->pendaftar()->create();
        Sanctum::actingAs($owner);

        $foreignMedia = Media::factory()->create([
            'user_id' => $other->id,
            'collection' => 'pmb',
            'mime_type' => 'application/pdf',
            'path' => 'uploads/pmb/other-proof.pdf',
            'disk' => 'local',
        ]);

        $this->getJson('/api/v1/pmb/portal/registration?school_id='.$school->id)->assertOk();

        $this->patchJson('/api/v1/pmb/portal/registration', [
            'school_id' => $school->id,
            'payment_info' => [
                'proof_media_id' => $foreignMedia->id,
            ],
        ])->assertUnprocessable();
    }

    public function test_portal_message_rejects_foreign_media(): void
    {
        $school = School::factory()->create();
        $owner = User::factory()->pendaftar()->create();
        $other = User::factory()->pendaftar()->create();
        Sanctum::actingAs($owner);

        $registration = PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $owner->id,
            'status' => 'awaiting_verification',
        ]);

        $foreignMedia = Media::factory()->create([
            'user_id' => $other->id,
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/other.jpg',
            'disk' => 'local',
        ]);

        $this->postJson('/api/v1/pmb/portal/registrations/'.$registration->uuid.'/messages', [
            'body' => 'Lampiran',
            'media_id' => $foreignMedia->id,
        ])->assertUnprocessable();
    }

    public function test_pmb_media_requires_valid_signature(): void
    {
        $media = Media::factory()->create([
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/test.jpg',
            'disk' => 'local',
        ]);

        $this->getJson('/api/v1/pmb/portal/media/'.$media->uuid)->assertForbidden();
    }

    public function test_pmb_media_serves_file_with_relative_signed_url(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('uploads/pmb/test.jpg', 'fake-image');

        $media = Media::factory()->create([
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/test.jpg',
            'disk' => 'local',
            'original_name' => 'test.jpg',
        ]);

        $url = \App\Support\PmbMediaUrl::resolve($media);
        $this->assertIsString($url);
        $this->assertStringStartsWith('/api/v1/pmb/portal/media/', $url);

        $this->get($url)->assertOk();
    }
}
