<?php

namespace App\Support;

final class SafeUrl
{
    private const BLOCKED_PREFIXES = [
        'javascript:',
        'data:',
        'vbscript:',
        'file:',
    ];

    public static function isAllowed(?string $url): bool
    {
        if ($url === null) {
            return false;
        }

        $url = trim($url);
        if ($url === '') {
            return false;
        }

        $lower = strtolower($url);
        foreach (self::BLOCKED_PREFIXES as $prefix) {
            if (str_starts_with($lower, $prefix)) {
                return false;
            }
        }

        if (str_starts_with($url, '/')) {
            return ! str_starts_with($url, '//');
        }

        if (str_starts_with($url, '#')) {
            return true;
        }

        return (bool) preg_match('/^https?:\/\//i', $url) || str_starts_with($lower, 'mailto:');
    }

    public static function sanitize(?string $url): ?string
    {
        return self::isAllowed($url) ? trim((string) $url) : null;
    }

    public static function isYoutubeEmbed(?string $url): bool
    {
        if (! self::isAllowed($url)) {
            return false;
        }

        return (bool) preg_match(
            '/^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\//i',
            trim((string) $url),
        );
    }
}
