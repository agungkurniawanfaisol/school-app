<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;

class AllowedFrontendUrl
{
    public static function base(): string
    {
        $configured = rtrim((string) config('services.google.frontend_url'), '/');

        if ($configured !== '' && self::isAllowed($configured)) {
            return $configured;
        }

        $appUrl = rtrim((string) config('app.url'), '/');
        if ($appUrl !== '' && self::isAllowed($appUrl)) {
            if ($configured !== '' && $configured !== $appUrl) {
                Log::warning('Google OAuth: FRONTEND_URL not in SANCTUM_STATEFUL_DOMAINS, using APP_URL', [
                    'frontend_url' => $configured,
                    'app_url' => $appUrl,
                ]);
            }

            return $appUrl;
        }

        Log::error('Google OAuth: FRONTEND_URL/APP_URL not in SANCTUM_STATEFUL_DOMAINS', [
            'frontend_url' => $configured,
            'app_url' => $appUrl,
        ]);

        // Local/test fallback only — never send production users to localhost.
        if (app()->environment(['local', 'testing'])) {
            return 'http://localhost:5173';
        }

        return $appUrl !== '' ? $appUrl : $configured;
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

        if ($allowed->isEmpty()) {
            return true;
        }

        return $allowed->contains($hostPort);
    }
}
