<?php

namespace App\Support;

final class HeroCollage
{
    /** @var list<string> */
    public const ALLOWED_COLORS = [
        'from-primary/30 to-primary/10',
        'from-primary/40 to-primary/10',
        'from-[var(--gold-accent)]/30 to-primary/10',
        'from-primary/25 to-accent/40',
        'from-accent/40 to-primary/15',
        'from-primary/50 to-primary/20',
    ];

    /**
     * @return array{subtitle: string, items: list<array{letter: string, label: string, color: string}>}
     */
    public static function defaultPayload(): array
    {
        return [
            'subtitle' => 'Lingkungan belajar yang hangat & inspiratif',
            'items' => [
                [
                    'letter' => 'T',
                    'label' => 'Tahfidz',
                    'color' => 'from-primary/30 to-primary/10',
                ],
                [
                    'letter' => 'A',
                    'label' => 'Akademik',
                    'color' => 'from-primary/40 to-primary/10',
                ],
                [
                    'letter' => 'K',
                    'label' => 'Karakter',
                    'color' => 'from-[var(--gold-accent)]/30 to-primary/10',
                ],
                [
                    'letter' => 'K',
                    'label' => 'Kegiatan',
                    'color' => 'from-primary/25 to-accent/40',
                ],
            ],
        ];
    }

    public static function isHeroCollageKey(?string $key): bool
    {
        return $key === 'hero_collage';
    }

    /**
     * @return list<string> Validation error messages (empty if valid).
     */
    public static function validateValue(?string $raw): array
    {
        if ($raw === null || $raw === '') {
            return ['Nilai collage hero wajib diisi.'];
        }

        try {
            $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return ['Format JSON collage hero tidak valid.'];
        }

        if (! is_array($decoded)) {
            return ['Format JSON collage hero tidak valid.'];
        }

        $errors = [];

        if (! isset($decoded['subtitle']) || ! is_string($decoded['subtitle'])) {
            $errors[] = 'Caption collage wajib berupa teks.';
        } elseif (mb_strlen($decoded['subtitle']) > 200) {
            $errors[] = 'Caption collage maksimal 200 karakter.';
        }

        if (! isset($decoded['items']) || ! is_array($decoded['items'])) {
            $errors[] = 'Daftar item collage wajib diisi.';

            return $errors;
        }

        if (count($decoded['items']) !== 4) {
            $errors[] = 'Collage hero harus berisi tepat 4 item.';
        }

        foreach (array_values($decoded['items']) as $index => $item) {
            $n = $index + 1;
            if (! is_array($item)) {
                $errors[] = "Item collage ke-{$n} tidak valid.";

                continue;
            }

            $label = $item['label'] ?? null;
            if (! is_string($label) || trim($label) === '') {
                $errors[] = "Label item ke-{$n} wajib diisi.";
            } elseif (mb_strlen($label) > 40) {
                $errors[] = "Label item ke-{$n} maksimal 40 karakter.";
            }

            if (array_key_exists('letter', $item) && $item['letter'] !== null && $item['letter'] !== '') {
                if (! is_string($item['letter']) || mb_strlen($item['letter']) > 2) {
                    $errors[] = "Huruf item ke-{$n} maksimal 2 karakter.";
                }
            }

            $color = $item['color'] ?? null;
            if (! is_string($color) || ! in_array($color, self::ALLOWED_COLORS, true)) {
                $errors[] = "Warna item ke-{$n} tidak diizinkan.";
            }
        }

        return $errors;
    }
}
