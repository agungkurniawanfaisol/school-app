<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    public function test_login_success_returns_token(): void
    {
        $admin = User::factory()->admin()->create([
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => $admin->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['message', 'data' => ['token', 'user']])
            ->assertJsonPath('data.user.email', $admin->email);
    }

    public function test_wrong_password_returns_422_with_email_error(): void
    {
        $admin = User::factory()->admin()->create([
            'password' => Hash::make('password123'),
        ]);

        $this->postJson('/api/admin/login', [
            'email' => $admin->email,
            'password' => 'wrongpassword',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_inactive_admin_cannot_login(): void
    {
        $admin = User::factory()->admin()->inactive()->create([
            'password' => Hash::make('password123'),
        ]);

        $this->postJson('/api/admin/login', [
            'email' => $admin->email,
            'password' => 'password123',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_non_panel_user_gets_403_on_login(): void
    {
        $user = User::factory()->create([
            'role' => 'editor',
            'password' => Hash::make('password123'),
        ]);

        $this->postJson('/api/admin/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->assertForbidden();
    }

    public function test_me_returns_user_when_sanctum_admin(): void
    {
        $admin = $this->sanctumAdmin();

        $this->getJson('/api/admin/me')
            ->assertOk()
            ->assertJsonPath('data.id', $admin->id)
            ->assertJsonPath('data.email', $admin->email)
            ->assertJsonPath('data.role', 'admin');
    }

    public function test_logout_works(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/admin/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout berhasil.');
    }

    public function test_guest_gets_401_on_admin_me(): void
    {
        $this->getJson('/api/admin/me')->assertUnauthorized();
    }

    public function test_guru_gets_403_on_admin_news(): void
    {
        $this->actingAsGuru()
            ->getJson('/api/admin/news')
            ->assertForbidden();
    }
}
