<?php

namespace Tests\Feature\Admin;

use App\Models\Announcement;
use App\Models\School;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnnouncementAdminTest extends TestCase
{
    public function test_admin_can_update_announcement_when_slug_is_null(): void
    {
        $school = School::factory()->create();
        $announcement = Announcement::query()->create([
            'school_id' => $school->id,
            'title' => 'Judul Lama',
            'slug' => 'judul-lama',
            'content' => 'Konten lama',
            'priority' => 'normal',
            'is_pinned' => false,
            'is_active' => true,
            'order' => 0,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $this->putJson('/api/admin/announcements/'.$announcement->id, [
            'school_id' => $school->id,
            'title' => 'Pendaftaran Siswa Baru 2026/2027 Telah Dibuka!',
            'slug' => null,
            'content' => 'Segera daftarkan putra-putri Anda. Kuota terbatas.',
            'priority' => 'urgent',
            'is_pinned' => true,
            'published_at' => '2026-07-24T06:30',
            'expires_at' => '2026-08-26T06:30',
            'order' => 1,
            'is_active' => true,
            'cta_text' => 'Daftar Sekarang',
            'cta_url' => '/pmb/daftar',
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Pendaftaran Siswa Baru 2026/2027 Telah Dibuka!')
            ->assertJsonPath('data.slug', 'judul-lama')
            ->assertJsonPath('data.content', 'Segera daftarkan putra-putri Anda. Kuota terbatas.')
            ->assertJsonPath('data.priority', 'urgent');

        $this->assertDatabaseHas('announcements', [
            'id' => $announcement->id,
            'slug' => 'judul-lama',
            'content' => 'Segera daftarkan putra-putri Anda. Kuota terbatas.',
        ]);
    }

    public function test_admin_can_create_announcement_without_slug(): void
    {
        $school = School::factory()->create();
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson('/api/admin/announcements', [
            'school_id' => $school->id,
            'title' => 'Pengumuman Baru Sekolah',
            'slug' => null,
            'content' => 'Isi pengumuman.',
            'priority' => 'important',
            'is_pinned' => false,
            'is_active' => true,
            'order' => 0,
        ])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Pengumuman Baru Sekolah');

        $created = Announcement::query()->where('title', 'Pengumuman Baru Sekolah')->first();
        $this->assertNotNull($created);
        $this->assertNotSame('', (string) $created->slug);
        $this->assertSame('Isi pengumuman.', $created->content);
    }

    public function test_update_does_not_replace_content_with_raw_request_body(): void
    {
        $school = School::factory()->create();
        $announcement = Announcement::query()->create([
            'school_id' => $school->id,
            'title' => 'Judul',
            'slug' => 'judul',
            'content' => 'Konten asli',
            'priority' => 'normal',
            'is_active' => true,
            'order' => 0,
        ]);

        Sanctum::actingAs(User::factory()->admin()->create());

        $response = $this->putJson('/api/admin/announcements/'.$announcement->id, [
            'title' => 'Judul Baru',
            'content' => 'Konten baru yang benar',
        ])->assertOk();

        $content = $response->json('data.content');
        $this->assertSame('Konten baru yang benar', $content);
        $this->assertStringNotContainsString('school_id', (string) $content);
        $this->assertStringNotContainsString('"title"', (string) $content);
    }
}
