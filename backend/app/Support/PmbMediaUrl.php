<?php

namespace App\Support;

use App\Models\Media;
use Illuminate\Support\Facades\URL;

class PmbMediaUrl
{
    public static function resolve(?Media $media, bool $download = false): ?string
    {
        if ($media === null || ! is_string($media->path) || $media->path === '') {
            return null;
        }

        if (str_contains($media->path, '..') || str_starts_with($media->path, '/')) {
            return null;
        }

        if ($media->collection === 'pmb' && $media->disk === 'local') {
            $parameters = ['media' => $media->uuid];
            if ($download) {
                $parameters['download'] = 1;
            }

            // Relative signed URL so browsers hit Vite/nginx proxy instead of Docker hostname.
            return URL::temporarySignedRoute(
                'v1.pmb.portal.media',
                now()->addHour(),
                $parameters,
                absolute: false,
            );
        }

        if ($media->disk === 'public') {
            return '/storage/'.$media->path;
        }

        return null;
    }
}
