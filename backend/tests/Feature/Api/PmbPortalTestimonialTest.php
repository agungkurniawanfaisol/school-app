<?php

namespace Tests\Feature\Api;

use App\Models\Media;
use App\Models\School;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PmbPortalTestimonialTest extends TestCase
{
    public function test_guest_cannot_access_portal_testimonial(): void
    {
        $this->getJson('/api/v1/pmb/portal/testimonial')->assertUnauthorized();
        $this->putJson('/api/v1/pmb/portal/testimonial', [])->assertUnauthorized();
    }

    public function test_pendaftar_can_create_testimonial_with_photo_and_rating(): void
    {
        Storage::fake('local');
        Storage::fake('public');

        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create(['name' => 'Ibu Siti']);
        Sanctum::actingAs($user);

        $media = Media::factory()->create([
            'user_id' => $user->id,
            'collection' => 'pmb',
            'disk' => 'local',
            'path' => 'uploads/pmb/photo.jpg',
            'mime_type' => 'image/jpeg',
        ]);
        Storage::disk('local')->put($media->path, 'fake-image');

        $this->putJson('/api/v1/pmb/portal/testimonial', [
            'school_id' => $school->id,
            'content' => 'Sekolah yang sangat baik untuk anak kami.',
            'rating' => 5,
            'photo_media_id' => $media->id,
        ])
            ->assertCreated()
            ->assertJsonPath('data.content', 'Sekolah yang sangat baik untuk anak kami.')
            ->assertJsonPath('data.rating', 5)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.is_active', false);

        $testimonial = Testimonial::query()->where('user_id', $user->id)->first();
        $this->assertNotNull($testimonial);
        $this->assertStringStartsWith('/storage/uploads/testimonials/', $testimonial->photo);
        $this->assertFalse($testimonial->is_active);
    }

    public function test_pendaftar_can_view_and_update_own_testimonial(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        Testimonial::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'content' => 'Testimoni awal yang cukup panjang.',
            'rating' => 4,
            'is_active' => true,
        ]);

        $this->getJson('/api/v1/pmb/portal/testimonial?school_id='.$school->id)
            ->assertOk()
            ->assertJsonPath('data.rating', 4);

        $this->putJson('/api/v1/pmb/portal/testimonial', [
            'school_id' => $school->id,
            'content' => 'Testimoni diperbarui setelah beberapa bulan.',
            'rating' => 5,
        ])
            ->assertOk()
            ->assertJsonPath('data.rating', 5)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.is_active', false);
    }

    public function test_portal_upload_accepts_testimonial_photo(): void
    {
        Storage::fake('local');
        $user = User::factory()->pendaftar()->create();
        Sanctum::actingAs($user);

        $file = UploadedFile::fake()->image('foto.jpg', 400, 400)->size(500);

        $this->postJson('/api/v1/pmb/portal/uploads', [
            'file' => $file,
            'collection' => 'pmb',
            'purpose' => 'testimonial_photo',
        ])->assertCreated();
    }
}
