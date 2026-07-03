<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.google.client_id' => 'test-client-id',
            'services.google.client_secret' => 'test-client-secret',
            'services.google.redirect' => 'http://localhost:8000/api/admin/auth/google/callback',
            'services.google.frontend_url' => 'http://localhost:5173',
        ]);
    }

    public function test_redirect_sends_user_to_google(): void
    {
        $response = $this->get('/api/admin/auth/google/redirect');

        $response->assertRedirect();
        $target = $response->headers->get('Location');
        $this->assertStringContainsString('accounts.google.com/o/oauth2/v2/auth', (string) $target);
        $this->assertStringContainsString('client_id=test-client-id', (string) $target);
    }

    public function test_callback_issues_ticket_for_registered_panel_user(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@gmail.com',
        ]);

        $state = (string) Str::uuid();
        Cache::put('google_oauth_state:'.$state, true, now()->addMinutes(10));

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'fake-access-token',
            ]),
            'www.googleapis.com/oauth2/v2/userinfo' => Http::response([
                'email' => 'admin@gmail.com',
                'name' => 'Admin User',
                'verified_email' => true,
            ]),
        ]);

        $response = $this->get('/api/admin/auth/google/callback?'.http_build_query([
            'code' => 'valid-auth-code',
            'state' => $state,
        ]));

        $response->assertRedirect();
        $location = (string) $response->headers->get('Location');
        $this->assertStringStartsWith('http://localhost:5173/admin/login/oauth#ticket=', $location);

        preg_match('/#ticket=([a-f0-9\-]+)/', $location, $matches);
        $this->assertNotEmpty($matches[1]);
        $this->assertSame($admin->id, Cache::get('oauth_ticket:'.$matches[1]));
    }

    public function test_callback_redirects_when_email_not_registered(): void
    {
        $state = (string) Str::uuid();
        Cache::put('google_oauth_state:'.$state, true, now()->addMinutes(10));

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response(['access_token' => 'fake-access-token']),
            'www.googleapis.com/oauth2/v2/userinfo' => Http::response([
                'email' => 'unknown@gmail.com',
                'name' => 'Unknown',
                'verified_email' => true,
            ]),
        ]);

        $this->get('/api/admin/auth/google/callback?'.http_build_query([
            'code' => 'valid-auth-code',
            'state' => $state,
        ]))
            ->assertRedirect('http://localhost:5173/admin/login?error=not_registered');
    }

    public function test_callback_redirects_when_user_inactive(): void
    {
        User::factory()->admin()->inactive()->create([
            'email' => 'inactive@gmail.com',
        ]);

        $state = (string) Str::uuid();
        Cache::put('google_oauth_state:'.$state, true, now()->addMinutes(10));

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response(['access_token' => 'fake-access-token']),
            'www.googleapis.com/oauth2/v2/userinfo' => Http::response([
                'email' => 'inactive@gmail.com',
                'verified_email' => true,
            ]),
        ]);

        $this->get('/api/admin/auth/google/callback?'.http_build_query([
            'code' => 'valid-auth-code',
            'state' => $state,
        ]))
            ->assertRedirect('http://localhost:5173/admin/login?error=not_registered');
    }

    public function test_callback_redirects_when_user_not_panel_role(): void
    {
        User::factory()->create([
            'email' => 'editor@gmail.com',
            'role' => 'editor',
            'is_active' => true,
        ]);

        $state = (string) Str::uuid();
        Cache::put('google_oauth_state:'.$state, true, now()->addMinutes(10));

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response(['access_token' => 'fake-access-token']),
            'www.googleapis.com/oauth2/v2/userinfo' => Http::response([
                'email' => 'editor@gmail.com',
                'verified_email' => true,
            ]),
        ]);

        $this->get('/api/admin/auth/google/callback?'.http_build_query([
            'code' => 'valid-auth-code',
            'state' => $state,
        ]))
            ->assertRedirect('http://localhost:5173/admin/login?error=access_denied');
    }

    public function test_redirect_fails_when_google_not_configured(): void
    {
        config([
            'services.google.client_id' => '',
            'services.google.client_secret' => '',
        ]);

        $this->get('/api/admin/auth/google/redirect')
            ->assertRedirect('http://localhost:5173/admin/login?error=oauth_failed');
    }

    public function test_callback_redirects_on_unverified_google_email(): void
    {
        User::factory()->admin()->create(['email' => 'unverified@gmail.com']);

        $state = (string) Str::uuid();
        Cache::put('google_oauth_state:'.$state, true, now()->addMinutes(10));

        Http::fake([
            'oauth2.googleapis.com/token' => Http::response(['access_token' => 'fake-access-token']),
            'www.googleapis.com/oauth2/v2/userinfo' => Http::response([
                'email' => 'unverified@gmail.com',
                'verified_email' => false,
            ]),
        ]);

        $this->get('/api/admin/auth/google/callback?'.http_build_query([
            'code' => 'valid-auth-code',
            'state' => $state,
        ]))
            ->assertRedirect('http://localhost:5173/admin/login?error=oauth_failed');
    }

    public function test_callback_redirects_on_invalid_state(): void
    {
        $this->get('/api/admin/auth/google/callback?code=abc&state=invalid-state')
            ->assertRedirect('http://localhost:5173/admin/login?error=oauth_failed');
    }

    public function test_exchange_returns_token_for_valid_ticket(): void
    {
        $admin = User::factory()->admin()->create();
        $ticket = (string) Str::uuid();
        Cache::put('oauth_ticket:'.$ticket, $admin->id, now()->addSeconds(120));

        $this->postJson('/api/admin/auth/google/exchange', ['ticket' => $ticket])
            ->assertOk()
            ->assertJsonStructure(['message', 'data' => ['token', 'user']])
            ->assertJsonPath('data.user.email', $admin->email);

        $this->assertNull(Cache::get('oauth_ticket:'.$ticket));
    }

    public function test_exchange_rejects_invalid_ticket(): void
    {
        $this->postJson('/api/admin/auth/google/exchange', [
            'ticket' => (string) Str::uuid(),
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ticket']);
    }

    public function test_exchange_rejects_reused_ticket(): void
    {
        $admin = User::factory()->admin()->create();
        $ticket = (string) Str::uuid();
        Cache::put('oauth_ticket:'.$ticket, $admin->id, now()->addSeconds(120));

        $this->postJson('/api/admin/auth/google/exchange', ['ticket' => $ticket])->assertOk();

        $this->postJson('/api/admin/auth/google/exchange', ['ticket' => $ticket])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ticket']);
    }
}
