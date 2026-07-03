<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;

class AllowedFrontendUrl
{
    public static function base(): string
    {
        $configured = rtrim((string) config('services.google.frontend_url'), '/');

        if ($configured === '') {
            return 'http://localhost:5173';
        }

        if (! self::isAllowed($configured)) {
            Log::error('Google OAuth: FRONTEND_URL is not in SANCTUM_STATEFUL_DOMAINS', [
                'frontend_url' => $configured,
            ]);

            return 'http://localhost:5173';
        }

        return $configured;
    }

    public static function to(string $path): string
    {
        $path = str_starts_with($path, '/') ? $path : '/'.$path;

        return self::base().$path;
    }

    public static function isAllowed(string $url): bool
    {
        $host = parse_url($url, PHP_URL_HOST);
        if (! is_string($host) || $host === '') {
            return false;
        }

        $port = parse_url($url, PHP_URL_PORT);
        $hostPort = $port !== null ? "{$host}:{$port}" : $host;

        $allowed = collect(explode(',', (string) env('SANCTUM_STATEFUL_DOMAINS', '')))
            ->map(static fn (string $domain): string => trim($domain))
            ->filter();

        return $allowed->contains($hostPort);
    }
}
