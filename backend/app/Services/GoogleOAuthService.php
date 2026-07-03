<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleOAuthService
{
    public function isConfigured(): bool
    {
        return filled(config('services.google.client_id'))
            && filled(config('services.google.client_secret'))
            && filled(config('services.google.redirect'));
    }

    public function authorizationUrl(): ?string
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $state = (string) Str::uuid();
        Cache::put($this->stateCacheKey($state), true, now()->addMinutes(10));

        $query = http_build_query([
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => config('services.google.redirect'),
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'state' => $state,
            'access_type' => 'online',
            'prompt' => 'select_account',
        ]);

        return 'https://accounts.google.com/o/oauth2/v2/auth?'.$query;
    }

    public function validateState(?string $state): bool
    {
        if ($state === null || $state === '') {
            return false;
        }

        return Cache::pull($this->stateCacheKey($state)) === true;
    }

    /**
     * @return array{email: string, name: string|null}|null
     */
    public function fetchUserFromCode(string $code): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri' => config('services.google.redirect'),
            'grant_type' => 'authorization_code',
        ]);

        if (! $tokenResponse->successful()) {
            return null;
        }

        $accessToken = $tokenResponse->json('access_token');
        if (! is_string($accessToken) || $accessToken === '') {
            return null;
        }

        $userResponse = Http::withToken($accessToken)
            ->get('https://www.googleapis.com/oauth2/v2/userinfo');

        if (! $userResponse->successful()) {
            return null;
        }

        $email = $userResponse->json('email');
        if (! is_string($email) || $email === '') {
            return null;
        }

        if ($userResponse->json('verified_email') !== true) {
            return null;
        }

        $name = $userResponse->json('name');

        return [
            'email' => $email,
            'name' => is_string($name) ? $name : null,
        ];
    }

    private function stateCacheKey(string $state): string
    {
        return 'google_oauth_state:'.$state;
    }
}
