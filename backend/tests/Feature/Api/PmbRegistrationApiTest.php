<?php

namespace Tests\Feature\Api;

use App\Models\PmbRegistration;
use App\Models\School;
use Illuminate\Support\Str;
use Tests\TestCase;

class PmbRegistrationApiTest extends TestCase
{
    public function test_post_registrations_creates_record_with_registration_number(): void
    {
        $school = $this->createSchool();

        $response = $this->postJson('/api/v1/pmb/registrations', [
            'school_id' => $school->id,
            'student_name' => 'Ahmad Fauzi',
            'parent_name' => 'Budi Santoso',
            'parent_phone' => '081234567890',
            'grade_applied' => 'SD',
        ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'Pendaftaran berhasil dikirim.')
            ->assertJsonStructure(['data' => ['registration_number', 'student_name', 'status']]);

        $this->assertNotEmpty($response->json('data.registration_number'));
        $response->assertJsonMissing(['tracking_token']);

        $this->assertDatabaseHas('pmb_registrations', [
            'student_name' => 'Ahmad Fauzi',
            'school_id' => $school->id,
        ]);

        $registration = PmbRegistration::query()->where('student_name', 'Ahmad Fauzi')->first();
        $this->assertNotEmpty($registration->tracking_token);
    }

    public function test_post_registrations_validation_fails_when_required_fields_missing(): void
    {
        $this->postJson('/api/v1/pmb/registrations', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'school_id',
                'student_name',
                'parent_name',
                'parent_phone',
                'grade_applied',
            ]);
    }

    public function test_get_track_returns_registration_when_token_valid(): void
    {
        $registration = PmbRegistration::factory()->create([
            'tracking_token' => Str::random(64),
        ]);

        $this->getJson("/api/v1/pmb/track/{$registration->tracking_token}")
            ->assertOk()
            ->assertJsonPath('data.registration_number', $registration->registration_number)
            ->assertJsonMissing(['tracking_token']);
    }

    public function test_get_track_returns_404_when_token_invalid(): void
    {
        $this->getJson('/api/v1/pmb/track/invalid-token-that-does-not-exist')
            ->assertNotFound();
    }

    public function test_response_does_not_include_tracking_token(): void
    {
        $registration = PmbRegistration::factory()->create([
            'tracking_token' => Str::random(64),
        ]);

        $response = $this->getJson("/api/v1/pmb/track/{$registration->tracking_token}");

        $response->assertOk();
        $this->assertArrayNotHasKey('tracking_token', $response->json('data'));
    }
}
