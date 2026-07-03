<?php

namespace Tests\Feature\Admin;

use App\Models\School;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    public function test_guru_can_login(): void
    {
        $school = $this->createSchool();
        $teacher = Teacher::factory()->create(['school_id' => $school->id]);
        $guru = User::factory()->guru()->create([
            'password' => Hash::make('password123'),
            'teacher_id' => $teacher->id,
        ]);

        $this->postJson('/api/admin/login', [
            'email' => $guru->email,
            'password' => 'password123',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.role', 'guru');
    }

    public function test_non_panel_user_cannot_login(): void
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

    public function test_admin_can_list_users(): void
    {
        $this->sanctumAdmin();
        User::factory()->guru()->count(2)->create();

        $this->getJson('/api/admin/users')
            ->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_guru_cannot_list_users(): void
    {
        Sanctum::actingAs(User::factory()->guru()->create());

        $this->getJson('/api/admin/users')->assertForbidden();
    }

    public function test_admin_can_create_guru_user(): void
    {
        $this->sanctumAdmin();
        $school = $this->createSchool();
        $teacher = Teacher::factory()->create(['school_id' => $school->id]);

        $this->postJson('/api/admin/users', [
            'name' => 'Guru Baru',
            'email' => 'gurubaru@test.id',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'guru',
            'teacher_id' => $teacher->id,
            'is_active' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('data.role', 'guru')
            ->assertJsonPath('data.teacher_id', $teacher->id);
    }

    public function test_guru_can_view_and_update_profile(): void
    {
        $school = $this->createSchool();
        $teacher = Teacher::factory()->create([
            'school_id' => $school->id,
            'name' => 'Guru Demo',
            'subject' => 'Matematika',
        ]);
        $guru = User::factory()->guru()->create([
            'teacher_id' => $teacher->id,
        ]);
        Sanctum::actingAs($guru);

        $this->getJson('/api/admin/profile')
            ->assertOk()
            ->assertJsonPath('data.user.role', 'guru')
            ->assertJsonPath('data.teacher.subject', 'Matematika');

        $this->patchJson('/api/admin/profile', [
            'user' => ['name' => 'Guru Updated'],
            'teacher' => ['subject' => 'IPA', 'bio' => 'Bio baru'],
        ])
            ->assertOk()
            ->assertJsonPath('data.user.name', 'Guru Updated')
            ->assertJsonPath('data.teacher.subject', 'IPA');
    }
}
