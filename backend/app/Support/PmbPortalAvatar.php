<?php

namespace App\Support;

use App\Models\Media;
use App\Models\PmbRegistration;
use App\Models\User;

class PmbPortalAvatar
{
    public static function resolveForUser(User $user): ?string
    {
        if (! $user->isPendaftar()) {
            return null;
        }

        $registration = PmbRegistration::query()
            ->where('user_id', $user->id)
            ->latest('id')
            ->first();

        if ($registration === null) {
            return null;
        }

        $payload = $registration->draft_payload;
        if (! is_array($payload)) {
            return null;
        }

        $mediaId = $payload['student_photo_media_id'] ?? null;
        if (! is_numeric($mediaId) || (int) $mediaId <= 0) {
            return null;
        }

        $media = Media::query()
            ->whereKey((int) $mediaId)
            ->where('user_id', $user->id)
            ->where('collection', 'pmb')
            ->where('mime_type', 'like', 'image/%')
            ->first();

        if ($media === null || ! is_string($media->path) || $media->path === '') {
            return null;
        }

        return \App\Support\PmbMediaUrl::resolve($media);
    }
}
