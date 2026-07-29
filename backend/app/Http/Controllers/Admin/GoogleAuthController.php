<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\IssuesAdminToken;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\GoogleExchangeRequest;
use App\Models\User;
use App\Services\GoogleOAuthService;
use App\Support\AllowedFrontendUrl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GoogleAuthController extends Controller
{
    use IssuesAdminToken;

    public function __construct(
        private readonly GoogleOAuthService $googleOAuth,
    ) {}

    public function redirect(Request $request): RedirectResponse|JsonResponse
    {
        $intent = $request->query('intent') === GoogleOAuthService::INTENT_PMB
            ? GoogleOAuthService::INTENT_PMB
            : GoogleOAuthService::INTENT_ADMIN;

        $authorizationUrl = $this->googleOAuth->authorizationUrl($intent);
        $wantsJson = $request->expectsJson() || $request->query('format') === 'json';

        if ($authorizationUrl === null) {
            Log::warning('Google OAuth redirect blocked: credentials not configured', [
                'ip' => $request->ip(),
                'intent' => $intent,
            ]);

            if ($wantsJson) {
                return response()->json(['message' => 'Login Google tidak tersedia.'], 503);
            }

            $fallback = '/admin/login?error=oauth_failed';

            return redirect(AllowedFrontendUrl::to($fallback));
        }

        if ($wantsJson) {
            return response()->json(['url' => $authorizationUrl]);
        }

        return redirect()->away($authorizationUrl);
    }

    public function callback(Request $request): RedirectResponse
    {
        $statePayload = $this->googleOAuth->pullStatePayload($request->query('state'));

        if ($request->filled('error') || $statePayload === null) {
            Log::warning('Google OAuth failed: invalid state or provider error', [
                'ip' => $request->ip(),
                'error' => $request->query('error'),
            ]);

            return redirect(AllowedFrontendUrl::to('/admin/login?error=oauth_failed'));
        }

        $intent = $statePayload['intent'] === GoogleOAuthService::INTENT_PMB
            ? GoogleOAuthService::INTENT_PMB
            : GoogleOAuthService::INTENT_ADMIN;

        $code = $request->query('code');
        if (! is_string($code) || $code === '') {
            return redirect(AllowedFrontendUrl::to($this->oauthErrorPath($intent, 'oauth_failed')));
        }

        $googleUser = $this->googleOAuth->fetchUserFromCode($code);
        if ($googleUser === null) {
            Log::warning('Google OAuth failed: token exchange or unverified email', ['ip' => $request->ip()]);

            return redirect(AllowedFrontendUrl::to($this->oauthErrorPath($intent, 'oauth_failed')));
        }

        $email = strtolower($googleUser['email']);

        if ($intent === GoogleOAuthService::INTENT_PMB) {
            return $this->handlePmbCallback($email, $googleUser['name'], $request);
        }

        return $this->handleAdminCallback($email, $request);
    }

    public function exchange(GoogleExchangeRequest $request): JsonResponse
    {
        $ticket = $request->validated('ticket');
        $cacheKey = 'oauth_ticket:'.$ticket;
        $payload = Cache::pull($cacheKey);

        if ($payload === null) {
            throw ValidationException::withMessages([
                'ticket' => ['Tiket login tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        $userId = is_array($payload) ? ($payload['user_id'] ?? null) : $payload;
        $intent = is_array($payload) ? ($payload['intent'] ?? GoogleOAuthService::INTENT_ADMIN) : GoogleOAuthService::INTENT_ADMIN;

        $user = User::query()
            ->whereKey($userId)
            ->where('is_active', true)
            ->first();

        if ($user === null) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        if ($intent === GoogleOAuthService::INTENT_PMB) {
            if (! $user->isPendaftar()) {
                return response()->json(['message' => 'Akses ditolak.'], 403);
            }

            return $this->issueAuthResponse($user);
        }

        if (! $user->isPanelUser()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        return $this->issueAuthResponse($user);
    }

    private function handleAdminCallback(string $email, Request $request): RedirectResponse
    {
        $user = User::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        if ($user !== null) {
            if (! $user->is_active) {
                Log::warning('Google OAuth: inactive user', [
                    'email' => $email,
                    'ip' => $request->ip(),
                ]);

                return redirect(AllowedFrontendUrl::to('/admin/login?error=access_denied'));
            }

            if ($user->isPendaftar()) {
                return $this->redirectWithOAuthTicket($user, GoogleOAuthService::INTENT_PMB);
            }

            if ($user->isPanelUser()) {
                return $this->redirectWithOAuthTicket($user, GoogleOAuthService::INTENT_ADMIN);
            }

            Log::warning('Google OAuth: access denied for unsupported role', [
                'email' => $email,
                'ip' => $request->ip(),
            ]);

            return redirect(AllowedFrontendUrl::to('/admin/login?error=access_denied'));
        }

        Log::info('Google OAuth: creating pendaftar account', [
            'email' => $email,
            'ip' => $request->ip(),
        ]);

        $user = User::query()->create([
            'name' => Str::before($email, '@'),
            'email' => $email,
            'password' => Hash::make(Str::random(64)),
            'role' => User::ROLE_PENDAFTAR,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        return $this->redirectWithOAuthTicket($user, GoogleOAuthService::INTENT_PMB);
    }

    private function redirectWithOAuthTicket(User $user, string $intent): RedirectResponse
    {
        $ticket = (string) Str::uuid();
        Cache::put('oauth_ticket:'.$ticket, [
            'user_id' => $user->id,
            'intent' => $intent,
        ], now()->addSeconds(120));

        return redirect(AllowedFrontendUrl::to('/admin/login/oauth?ticket='.$ticket));
    }

    private function handlePmbCallback(string $email, ?string $name, Request $request): RedirectResponse
    {
        $user = User::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        if ($user !== null) {
            if (! $user->is_active) {
                return redirect(AllowedFrontendUrl::to('/admin/login?error=access_denied'));
            }

            if ($user->isPanelUser()) {
                Log::warning('Google OAuth PMB: panel user cannot use applicant login', [
                    'email' => $email,
                    'ip' => $request->ip(),
                ]);

                return redirect(AllowedFrontendUrl::to('/admin/login?error=access_denied'));
            }

            if (! $user->isPendaftar()) {
                return redirect(AllowedFrontendUrl::to('/admin/login?error=access_denied'));
            }
        } else {
            $user = User::query()->create([
                'name' => $name ?: Str::before($email, '@'),
                'email' => $email,
                'password' => Hash::make(Str::random(64)),
                'role' => User::ROLE_PENDAFTAR,
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }

        return $this->redirectWithOAuthTicket($user, GoogleOAuthService::INTENT_PMB);
    }

    private function oauthErrorPath(string $intent, string $error): string
    {
        return '/admin/login?error='.$error;
    }
}
