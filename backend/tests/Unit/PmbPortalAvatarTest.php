<?php

namespace Tests\Unit;

use App\Models\Media;
use App\Models\PmbRegistration;
use App\Models\School;
use App\Models\User;
use App\Support\PmbPortalAvatar;
use Tests\TestCase;

class PmbPortalAvatarTest extends TestCase
{
    public function test_resolves_avatar_from_owned_student_photo_media(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
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
            'draft_payload' => ['student_photo_media_id' => $media->id],
        ]);

        $avatarUrl = PmbPortalAvatar::resolveForUser($user);
        $this->assertIsString($avatarUrl);
        $this->assertStringContainsString('/api/v1/pmb/portal/media/', $avatarUrl);
        $this->assertStringContainsString('signature=', $avatarUrl);
    }

    public function test_rejects_foreign_or_non_image_media(): void
    {
        $school = School::factory()->create();
        $user = User::factory()->pendaftar()->create();
        $other = User::factory()->pendaftar()->create();
        $foreign = Media::factory()->create([
            'user_id' => $other->id,
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/other.jpg',
        ]);

        PmbRegistration::factory()->create([
            'school_id' => $school->id,
            'user_id' => $user->id,
            'draft_payload' => ['student_photo_media_id' => $foreign->id],
        ]);

        $this->assertNull(PmbPortalAvatar::resolveForUser($user));
    }
}
