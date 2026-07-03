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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GoogleAuthController extends Controller
{
    use IssuesAdminToken;

    public function __construct(
        private readonly GoogleOAuthService $googleOAuth,
    ) {}

    public function redirect(): RedirectResponse
    {
        $authorizationUrl = $this->googleOAuth->authorizationUrl();

        if ($authorizationUrl === null) {
            Log::warning('Google OAuth redirect blocked: credentials not configured', [
                'ip' => request()->ip(),
            ]);

            return redirect(AllowedFrontendUrl::to('/admin/login?error=oauth_failed'));
        }

        return redirect()->away($authorizationUrl);
    }

    public function callback(Request $request): RedirectResponse
    {
        if ($request->filled('error') || ! $this->googleOAuth->validateState($request->query('state'))) {
            Log::warning('Google OAuth failed: invalid state or provider error', [
                'ip' => $request->ip(),
                'error' => $request->query('error'),
            ]);

            return redirect(AllowedFrontendUrl::to('/admin/login?error=oauth_failed'));
        }

        $code = $request->query('code');
        if (! is_string($code) || $code === '') {
            return redirect(AllowedFrontendUrl::to('/admin/login?error=oauth_failed'));
        }

        $googleUser = $this->googleOAuth->fetchUserFromCode($code);
        if ($googleUser === null) {
            Log::warning('Google OAuth failed: token exchange or unverified email', ['ip' => $request->ip()]);

            return redirect(AllowedFrontendUrl::to('/admin/login?error=oauth_failed'));
        }

        $email = strtolower($googleUser['email']);
        $user = User::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->where('is_active', true)
            ->first();

        if ($user === null) {
            Log::warning('Google OAuth: email not registered', [
                'email' => $email,
                'ip' => $request->ip(),
            ]);

            return redirect(AllowedFrontendUrl::to('/admin/login?error=not_registered'));
        }

        if (! $user->isPanelUser()) {
            Log::warning('Google OAuth: access denied for non-panel user', [
                'email' => $email,
                'ip' => $request->ip(),
            ]);

            return redirect(AllowedFrontendUrl::to('/admin/login?error=access_denied'));
        }

        $ticket = (string) Str::uuid();
        Cache::put('oauth_ticket:'.$ticket, $user->id, now()->addSeconds(120));

        return redirect(AllowedFrontendUrl::to('/admin/login/oauth#ticket='.$ticket));
    }

    public function exchange(GoogleExchangeRequest $request): JsonResponse
    {
        $ticket = $request->validated('ticket');
        $cacheKey = 'oauth_ticket:'.$ticket;
        $userId = Cache::pull($cacheKey);

        if ($userId === null) {
            throw ValidationException::withMessages([
                'ticket' => ['Tiket login tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        $user = User::query()
            ->whereKey($userId)
            ->where('is_active', true)
            ->first();

        if ($user === null || ! $user->isPanelUser()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        return $this->issueAuthResponse($user);
    }
}
