<?php

namespace Tests\Feature\Api;

use App\Models\Teacher;
use Tests\Concerns\AssertsPublicReadApi;
use Tests\TestCase;

class TeacherApiTest extends TestCase
{
    use AssertsPublicReadApi;

    public function test_list_returns_only_active_teachers(): void
    {
        $this->assertPublicListReturnsOnlyActive(
            '/api/v1/teachers',
            Teacher::factory(),
            Teacher::factory()->inactive(),
        );
    }

    public function test_show_returns_teacher_by_slug(): void
    {
        $teacher = Teacher::factory()->create([
            'bio' => 'Bio singkat guru.',
            'content' => '<p>Profil lengkap.</p>',
        ]);

        $this->getJson("/api/v1/teachers/{$teacher->slug}")
            ->assertOk()
            ->assertJsonPath('data.slug', $teacher->slug)
            ->assertJsonPath('data.id', $teacher->id)
            ->assertJsonPath('data.bio', 'Bio singkat guru.')
            ->assertJsonPath('data.content', '<p>Profil lengkap.</p>');
    }

    public function test_show_by_uuid_returns_full_profile_content(): void
    {
        $teacher = Teacher::factory()->create([
            'bio' => 'Bio via UUID.',
            'content' => '<p>Konten profil via UUID.</p>',
            'content_json' => ['type' => 'doc', 'content' => []],
        ]);

        $this->getJson("/api/v1/teachers/uuid/{$teacher->uuid}")
            ->assertOk()
            ->assertJsonPath('data.uuid', $teacher->uuid)
            ->assertJsonPath('data.bio', 'Bio via UUID.')
            ->assertJsonPath('data.content', '<p>Konten profil via UUID.</p>')
            ->assertJsonPath('data.content_json.type', 'doc');
    }

    public function test_inactive_teacher_returns_404_on_show(): void
    {
        $teacher = Teacher::factory()->inactive()->create();

        $this->assertInactiveHiddenFromShow('/api/v1/teachers', $teacher);
    }

    public function test_invalid_uuid_format_returns_404(): void
    {
        $this->getJson('/api/v1/teachers/uuid/not-a-valid-uuid')
            ->assertNotFound();
    }

    public function test_invalid_slug_format_returns_404(): void
    {
        $this->getJson('/api/v1/teachers/invalid slug!')
            ->assertNotFound();
    }

    public function test_list_filters_by_type_guru(): void
    {
        Teacher::factory()->create(['type' => 'guru']);
        Teacher::factory()->kepalaSekolah()->create();
        Teacher::factory()->staff()->create();

        $this->getJson('/api/v1/teachers?type=guru')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.type', 'guru');
    }

    public function test_list_filters_by_type_kepala_sekolah(): void
    {
        Teacher::factory()->count(2)->create(['type' => 'guru']);
        Teacher::factory()->kepalaSekolah()->create();

        $this->getJson('/api/v1/teachers?type=kepala_sekolah')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.type', 'kepala_sekolah');
    }

    public function test_list_filters_by_type_staff(): void
    {
        Teacher::factory()->count(2)->create(['type' => 'guru']);
        Teacher::factory()->staff()->count(3)->create();

        $this->getJson('/api/v1/teachers?type=staff')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_show_includes_type_field(): void
    {
        $teacher = Teacher::factory()->kepalaSekolah()->create();

        $this->getJson("/api/v1/teachers/{$teacher->slug}")
            ->assertOk()
            ->assertJsonPath('data.type', 'kepala_sekolah');
    }
}
