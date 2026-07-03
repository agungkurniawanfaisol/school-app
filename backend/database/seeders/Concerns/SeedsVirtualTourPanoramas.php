<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

trait SeedsVirtualTourPanoramas
{
    /**
     * Known equirectangular 360° demo panoramas (Pannellum / Marzipano).
     *
     * @return array<int, array{filename: string, url: string, scene_key: string}>
     */
    protected function virtualTourPanoramaSources(): array
    {
        return [
            [
                'filename' => 'gerbang-utama.jpg',
                'url' => 'https://pannellum.org/images/alma.jpg',
                'scene_key' => 'gate',
            ],
            [
                'filename' => 'halaman-sekolah.jpg',
                'url' => 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/examples/examplepano.jpg',
                'scene_key' => 'yard',
            ],
            [
                'filename' => 'ruang-kelas.jpg',
                'url' => 'https://pannellum.org/images/cerro-toco-0.jpg',
                'scene_key' => 'classroom',
            ],
            [
                'filename' => 'perpustakaan.jpg',
                'url' => 'https://pannellum.org/images/cerro-toco-1.jpg',
                'scene_key' => 'library',
            ],
            [
                'filename' => 'musholla.jpg',
                'url' => 'https://www.marzipano.org/media/equirectangular/equirectangular-0.jpg',
                'scene_key' => 'musholla',
            ],
        ];
    }

    protected function ensureVirtualTourPanorama(string $filename, string $sceneKey, ?string $downloadUrl = null): string
    {
        $relative = "uploads/virtual-tour/{$filename}";
        $disk = Storage::disk('public');

        if (! $disk->exists($relative)) {
            $disk->makeDirectory('uploads/virtual-tour');
            $disk->put($relative, $this->resolvePanoramaBytes($filename, $sceneKey, $downloadUrl));
        }

        return '/storage/'.$relative;
    }

    protected function resolvePanoramaBytes(string $filename, string $sceneKey, ?string $downloadUrl): string
    {
        if ($downloadUrl !== null) {
            try {
                $response = Http::timeout(90)
                    ->retry(2, 1000)
                    ->withHeaders(['User-Agent' => 'NurulHikmahApp-Seeder/1.0'])
                    ->get($downloadUrl);

                if ($response->successful() && $this->isValidPanoramaBytes($response->body())) {
                    return $response->body();
                }
            } catch (\Throwable) {
                // Offline or blocked — try bundled asset or GD fallback.
            }
        }

        $assetPath = database_path('seeders/assets/virtual-tour/'.$filename);

        if (is_file($assetPath)) {
            $bytes = (string) file_get_contents($assetPath);

            if ($this->isValidPanoramaBytes($bytes)) {
                return $bytes;
            }
        }

        return $this->generateEquirectangularPanorama($sceneKey);
    }

    protected function isValidPanoramaBytes(string $bytes): bool
    {
        if (strlen($bytes) < 10_000 || ! str_starts_with($bytes, "\xFF\xD8")) {
            return false;
        }

        $info = @getimagesizefromstring($bytes);

        if ($info === false) {
            return false;
        }

        $ratio = $info[0] / max(1, $info[1]);

        return $ratio >= 1.8 && $ratio <= 2.2;
    }

    protected function generateEquirectangularPanorama(string $sceneKey): string
    {
        $width = 2048;
        $height = 1024;
        $image = imagecreatetruecolor($width, $height);

        $palettes = [
            'gate' => ['sky' => [120, 185, 235], 'ground' => [72, 130, 72], 'accent' => [180, 140, 90]],
            'yard' => ['sky' => [100, 170, 230], 'ground' => [88, 150, 78], 'accent' => [210, 180, 120]],
            'classroom' => ['sky' => [230, 230, 225], 'ground' => [160, 130, 100], 'accent' => [70, 110, 170]],
            'library' => ['sky' => [215, 210, 200], 'ground' => [130, 95, 70], 'accent' => [120, 80, 50]],
            'musholla' => ['sky' => [235, 225, 205], 'ground' => [150, 125, 95], 'accent' => [30, 110, 80]],
        ];

        $palette = $palettes[$sceneKey] ?? $palettes['yard'];

        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width; $x++) {
                $yaw = (($x / $width) * 360.0) - 180.0;
                $pitch = 90.0 - (($y / $height) * 180.0);

                [$r, $g, $b] = $this->panoramaPixelColor($pitch, $yaw, $palette);
                $color = ($r << 16) | ($g << 8) | $b;
                imagesetpixel($image, $x, $y, $color);
            }
        }

        ob_start();
        imagejpeg($image, null, 85);
        $jpeg = ob_get_clean() ?: '';
        imagedestroy($image);

        return $jpeg;
    }

    /**
     * @param  array{sky: array{int, int, int}, ground: array{int, int, int}, accent: array{int, int, int}}  $palette
     * @return array{int, int, int}
     */
    private function panoramaPixelColor(float $pitch, float $yaw, array $palette): array
    {
        if ($pitch > 25) {
            $factor = min(1.0, ($pitch - 25) / 65);

            return $this->mixColor($palette['sky'], [255, 255, 255], $factor * 0.35);
        }

        if ($pitch < -15) {
            $factor = min(1.0, (-15 - $pitch) / 75);

            return $this->mixColor($palette['ground'], [40, 40, 40], $factor * 0.25);
        }

        $wallAngle = abs(fmod($yaw + 180.0, 90.0) - 45.0) / 45.0;
        $base = $this->mixColor($palette['accent'], $palette['ground'], $wallAngle * 0.45);

        if (abs($pitch) < 8 && abs(fmod($yaw, 60.0)) < 6) {
            $base = $this->mixColor($base, [255, 230, 180], 0.35);
        }

        return $base;
    }

    /**
     * @param  array{int, int, int}  $a
     * @param  array{int, int, int}  $b
     * @return array{int, int, int}
     */
    private function mixColor(array $a, array $b, float $ratio): array
    {
        $ratio = max(0.0, min(1.0, $ratio));

        return [
            (int) round($a[0] + ($b[0] - $a[0]) * $ratio),
            (int) round($a[1] + ($b[1] - $a[1]) * $ratio),
            (int) round($a[2] + ($b[2] - $a[2]) * $ratio),
        ];
    }
}
