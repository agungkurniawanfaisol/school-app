<?php

namespace Tests\Feature\Admin;

use App\Mail\GmailTestMail;
use App\Models\User;
use App\Services\GmailOAuthService;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
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

    public function test_admin_can_send_test_gmail_to_arbitrary_address(): void
    {
        Mail::fake();

        config([
            'services.google.client_id' => 'client-id',
            'services.google.client_secret' => 'client-secret',
            'services.google.gmail_redirect' => 'http://localhost:8000/api/admin/gmail/oauth/callback',
            'services.google.gmail_refresh_token' => 'refresh-token',
            'mail.from.address' => 'pmb@example.com',
            'mail.default' => 'array',
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson('/api/admin/gmail/send-test', [
            'to' => 'uji@example.com',
            'subject' => 'Tes Gmail',
            'body' => 'Ini email uji dari admin.',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Email uji berhasil dikirim.');

        Mail::assertSent(GmailTestMail::class, function (GmailTestMail $mail) {
            return $mail->hasTo('uji@example.com')
                && $mail->mailSubject === 'Tes Gmail'
                && $mail->body === 'Ini email uji dari admin.';
        });
    }

    public function test_send_test_gmail_requires_ready_oauth(): void
    {
        Mail::fake();

        config([
            'services.google.client_id' => 'client-id',
            'services.google.client_secret' => 'client-secret',
            'services.google.gmail_redirect' => 'http://localhost:8000/api/admin/gmail/oauth/callback',
            'services.google.gmail_refresh_token' => null,
            'mail.from.address' => 'pmb@example.com',
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson('/api/admin/gmail/send-test', [
            'to' => 'uji@example.com',
            'subject' => 'Tes',
            'body' => 'Isi',
        ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Gmail belum siap mengirim. Hubungkan akun Gmail terlebih dahulu.');

        Mail::assertNothingSent();
    }

    public function test_send_test_gmail_validates_email(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson('/api/admin/gmail/send-test', [
            'to' => 'bukan-email',
            'subject' => 'Tes',
            'body' => 'Isi',
        ])->assertStatus(422);
    }

    public function test_guest_cannot_send_test_gmail(): void
    {
        $this->postJson('/api/admin/gmail/send-test', [
            'to' => 'uji@example.com',
            'subject' => 'Tes',
            'body' => 'Isi',
        ])->assertUnauthorized();
    }
}
