<?php

namespace App\Support;

final class GoogleMapsEmbed
{
    public const MAX_LENGTH = 2000;

    public static function normalize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return null;
        }

        if (preg_match('/\bsrc\s*=\s*["\']([^"\']+)["\']/i', $value, $matches) === 1) {
            $value = html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $value = trim($value);
        }

        return $value === '' ? null : $value;
    }

    public static function isValidEmbedUrl(?string $url): bool
    {
        if ($url === null || $url === '') {
            return false;
        }

        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return false;
        }

        $parts = parse_url($url);
        if (($parts['scheme'] ?? '') !== 'https') {
            return false;
        }

        $host = strtolower((string) ($parts['host'] ?? ''));
        if (! preg_match('/^(?:www\.)?(?:maps\.)?google\.(?:com|co\.\w+)$/', $host)) {
            return false;
        }

        $path = (string) ($parts['path'] ?? '');
        $query = (string) ($parts['query'] ?? '');

        if (str_contains($path, '/maps/embed')) {
            return true;
        }

        return str_contains($path, '/maps') && str_contains($query, 'output=embed');
    }
}
