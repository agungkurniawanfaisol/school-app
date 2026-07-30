<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Services\GmailOAuthService;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\File;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GmailOAuthAdminTest extends TestCase
{
    protected function tearDown(): void
    {
        $path = storage_path('app/private/gmail-oauth.json');
        if (File::exists($path)) {
            File::delete($path);
        }

        parent::tearDown();
    }

    public function test_guest_cannot_view_gmail_oauth_status(): void
    {
        $this->getJson('/api/admin/gmail/oauth/status')->assertUnauthorized();
    }

    public function test_admin_can_view_gmail_oauth_status(): void
    {
        config([
            'services.google.client_id' => 'client-id',
            'services.google.client_secret' => 'client-secret',
            'services.google.gmail_redirect' => 'http://localhost:8000/api/admin/gmail/oauth/callback',
            'mail.from.address' => 'pmb@example.com',
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson('/api/admin/gmail/oauth/status')
            ->assertOk()
            ->assertJsonPath('data.client_configured', true)
            ->assertJsonPath('data.connected', false)
            ->assertJsonPath('data.ready_to_send', false);
    }

    public function test_admin_pmb_cannot_connect_gmail(): void
    {
        Sanctum::actingAs(User::factory()->adminPmb()->create());

        $this->getJson('/api/admin/gmail/oauth/status')->assertForbidden();
    }

    public function test_status_ready_when_refresh_token_stored(): void
    {
        config([
            'services.google.client_id' => 'client-id',
            'services.google.client_secret' => 'client-secret',
            'services.google.gmail_redirect' => 'http://localhost:8000/api/admin/gmail/oauth/callback',
            'services.google.gmail_refresh_token' => null,
            'mail.from.address' => 'pmb@example.com',
        ]);

        File::ensureDirectoryExists(storage_path('app/private'));
        File::put(storage_path('app/private/gmail-oauth.json'), json_encode([
            'refresh_token' => Crypt::encryptString('refresh-token-value'),
        ]));

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->getJson('/api/admin/gmail/oauth/status')
            ->assertOk()
            ->assertJsonPath('data.connected', true)
            ->assertJsonPath('data.ready_to_send', true);
    }

    public function test_service_reads_refresh_token_from_env_first(): void
    {
        config([
            'services.google.gmail_refresh_token' => 'env-token',
        ]);

        $service = app(GmailOAuthService::class);

        $this->assertSame('env-token', $service->refreshToken());
    }
}
