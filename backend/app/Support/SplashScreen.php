<?php

namespace App\Support;

final class SplashScreen
{
    public const MIN_DURATION_MS = 1000;

    public const MAX_DURATION_MS = 5000;

    public const DEFAULT_DURATION_MS = 2500;

    /**
     * @return array{image: string, title: string, subtitle: string, duration_ms: int}
     */
    public static function defaultPayload(): array
    {
        return [
            'image' => '/logo.png',
            'title' => 'Sekolah Islam Nurul Hikmah',
            'subtitle' => '',
            'duration_ms' => self::DEFAULT_DURATION_MS,
        ];
    }

    public static function isSplashScreenKey(?string $key): bool
    {
        return $key === 'splash_screen';
    }

    /**
     * @return list<string>
     */
    public static function validateValue(?string $raw): array
    {
        if ($raw === null || $raw === '') {
            return ['Pengaturan splash screen wajib diisi.'];
        }

        try {
            $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return ['Format JSON splash screen tidak valid.'];
        }

        if (! is_array($decoded)) {
            return ['Format JSON splash screen tidak valid.'];
        }

        $errors = [];

        $image = $decoded['image'] ?? null;
        if ($image !== null && $image !== '') {
            if (! is_string($image)) {
                $errors[] = 'Gambar splash harus berupa URL.';
            } elseif (mb_strlen($image) > 500) {
                $errors[] = 'URL gambar splash maksimal 500 karakter.';
            } elseif (! SafeUrl::isAllowed($image)) {
                $errors[] = 'URL gambar splash tidak valid atau tidak diizinkan.';
            }
        }

        $title = $decoded['title'] ?? null;
        if (! is_string($title) || trim($title) === '') {
            $errors[] = 'Judul splash wajib diisi.';
        } elseif (mb_strlen($title) > 120) {
            $errors[] = 'Judul splash maksimal 120 karakter.';
        }

        if (array_key_exists('subtitle', $decoded) && $decoded['subtitle'] !== null && $decoded['subtitle'] !== '') {
            if (! is_string($decoded['subtitle'])) {
                $errors[] = 'Subjudul splash harus berupa teks.';
            } elseif (mb_strlen($decoded['subtitle']) > 200) {
                $errors[] = 'Subjudul splash maksimal 200 karakter.';
            }
        }

        $duration = $decoded['duration_ms'] ?? self::DEFAULT_DURATION_MS;
        if (! is_int($duration) && ! (is_string($duration) && ctype_digit($duration))) {
            $errors[] = 'Durasi splash harus berupa angka.';
        } else {
            $durationMs = (int) $duration;
            if ($durationMs < self::MIN_DURATION_MS || $durationMs > self::MAX_DURATION_MS) {
                $errors[] = 'Durasi splash harus antara '.self::MIN_DURATION_MS.'–'.self::MAX_DURATION_MS.' ms.';
            }
        }

        return $errors;
    }
}
