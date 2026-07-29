<?php

namespace App\Support;

use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class TestimonialPhotoPublisher
{
    public static function publishFromPmbMedia(Media $media): string
    {
        if ($media->collection !== 'pmb' || ! is_string($media->path) || $media->path === '' || str_contains($media->path, '..')) {
            throw new RuntimeException('Media foto tidak valid.');
        }

        $sourceDisk = Storage::disk($media->disk);
        if (! $sourceDisk->exists($media->path)) {
            throw new RuntimeException('Berkas foto tidak ditemukan.');
        }

        $extension = pathinfo($media->filename, PATHINFO_EXTENSION) ?: 'jpg';
        $newPath = 'uploads/testimonials/'.Str::uuid().'.'.$extension;

        Storage::disk('public')->put($newPath, $sourceDisk->get($media->path));

        return '/storage/'.$newPath;
    }
}
