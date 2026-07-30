<?php

namespace App\Services;

use Google\Client as GoogleClient;
use Google\Service\Gmail;
use Google\Service\Gmail\Message as GmailMessage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use RuntimeException;

class GmailOAuthService
{
    private const TOKEN_PATH = 'gmail-oauth.json';

    private const SCOPES = [
        Gmail::GMAIL_SEND,
        'openid',
        'email',
        'profile',
    ];

    public function isClientConfigured(): bool
    {
        return filled(config('services.google.client_id'))
            && filled(config('services.google.client_secret'))
            && filled(config('services.google.gmail_redirect'));
    }

    public function isReadyToSend(): bool
    {
        return $this->isClientConfigured()
            && filled($this->refreshToken())
            && filled(config('mail.from.address'));
    }

    public function status(): array
    {
        return [
            'client_configured' => $this->isClientConfigured(),
            'connected' => filled($this->refreshToken()),
            'ready_to_send' => $this->isReadyToSend(),
            'from_address' => config('mail.from.address'),
            'redirect_uri' => config('services.google.gmail_redirect'),
        ];
    }

    public function authorizationUrl(): string
    {
        if (! $this->isClientConfigured()) {
            throw new RuntimeException('Google Gmail OAuth belum dikonfigurasi (CLIENT_ID/SECRET/REDIRECT).');
        }

        $state = (string) Str::uuid();
        Cache::put($this->stateCacheKey($state), true, now()->addMinutes(15));

        $client = $this->baseClient();
        $client->setState($state);
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $client->setIncludeGrantedScopes(true);

        return $client->createAuthUrl();
    }

    /**
     * @return array{email: string|null}
     */
    public function handleCallback(string $code, ?string $state): array
    {
        if ($state === null || $state === '' || ! Cache::pull($this->stateCacheKey($state))) {
            throw new RuntimeException('State OAuth Gmail tidak valid atau sudah kedaluwarsa.');
        }

        $client = $this->baseClient();
        $token = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            throw new RuntimeException('Gagal menukar kode OAuth Gmail: '.($token['error_description'] ?? $token['error']));
        }

        $refreshToken = $token['refresh_token'] ?? null;
        if (! is_string($refreshToken) || $refreshToken === '') {
            throw new RuntimeException(
                'Google tidak mengembalikan refresh_token. Cabut akses aplikasi di akun Google, lalu hubungkan ulang dengan prompt consent.'
            );
        }

        $this->storeRefreshToken($refreshToken);

        $email = null;
        try {
            $client->setAccessToken($token);
            $oauth2 = new \Google\Service\Oauth2($client);
            $email = $oauth2->userinfo->get()->getEmail();
        } catch (\Throwable) {
            // Scope gmail.send may not include userinfo; from_address still set in .env.
        }

        return ['email' => $email];
    }

    public function sendRawMime(string $rawMimeMessage): void
    {
        if (! $this->isReadyToSend()) {
            throw new RuntimeException('Gmail OAuth belum siap. Hubungkan akun dan set MAIL_FROM_ADDRESS.');
        }

        $client = $this->authenticatedClient();
        $service = new Gmail($client);
        $message = new GmailMessage;
        $message->setRaw($this->base64UrlEncode($rawMimeMessage));
        $service->users_messages->send('me', $message);
    }

    public function refreshToken(): ?string
    {
        $fromEnv = config('services.google.gmail_refresh_token');
        if (is_string($fromEnv) && $fromEnv !== '') {
            return $fromEnv;
        }

        $path = $this->tokenStoragePath();
        if (! File::exists($path)) {
            return null;
        }

        try {
            $payload = json_decode((string) File::get($path), true, 512, JSON_THROW_ON_ERROR);
            $encrypted = $payload['refresh_token'] ?? null;
            if (! is_string($encrypted) || $encrypted === '') {
                return null;
            }

            return Crypt::decryptString($encrypted);
        } catch (\Throwable) {
            return null;
        }
    }

    public function storeRefreshToken(string $refreshToken): void
    {
        $path = $this->tokenStoragePath();
        File::ensureDirectoryExists(dirname($path));
        File::put($path, json_encode([
            'refresh_token' => Crypt::encryptString($refreshToken),
            'updated_at' => now()->toIso8601String(),
        ], JSON_THROW_ON_ERROR));
    }

    public function disconnect(): void
    {
        $path = $this->tokenStoragePath();
        if (File::exists($path)) {
            File::delete($path);
        }
    }

    private function authenticatedClient(): GoogleClient
    {
        $client = $this->baseClient();
        $refreshToken = $this->refreshToken();
        if ($refreshToken === null) {
            throw new RuntimeException('Refresh token Gmail tidak ditemukan.');
        }

        $client->fetchAccessTokenWithRefreshToken($refreshToken);
        $token = $client->getAccessToken();
        if (isset($token['error'])) {
            throw new RuntimeException('Gagal refresh access token Gmail: '.($token['error_description'] ?? $token['error']));
        }

        if (isset($token['refresh_token']) && is_string($token['refresh_token']) && $token['refresh_token'] !== '') {
            $this->storeRefreshToken($token['refresh_token']);
        }

        return $client;
    }

    private function baseClient(): GoogleClient
    {
        $client = new GoogleClient;
        $client->setClientId((string) config('services.google.client_id'));
        $client->setClientSecret((string) config('services.google.client_secret'));
        $client->setRedirectUri((string) config('services.google.gmail_redirect'));
        $client->setScopes(self::SCOPES);
        $client->setAccessType('offline');

        return $client;
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function tokenStoragePath(): string
    {
        return storage_path('app/private/'.self::TOKEN_PATH);
    }

    private function stateCacheKey(string $state): string
    {
        return 'gmail_oauth_state:'.$state;
    }
}
