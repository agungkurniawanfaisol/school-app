<?php

namespace Database\Seeders;

use App\Models\Curriculum;
use App\Models\Facility;
use App\Models\FacilityPhoto;
use App\Models\HeroSlider;
use App\Models\News;
use App\Models\School;
use App\Models\Setting;
use App\Models\StudentActivity;
use App\Models\Teacher;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@nurulhikmah.sch.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );

        $school = School::query()->updateOrCreate(
            ['slug' => 'nurul-hikmah'],
            [
                'name' => 'Sekolah Islam Nurul Hikmah',
                'tagline' => 'Membentuk Generasi Qurani dan Berakhlak Mulia',
                'description' => 'Sekolah Islam terpadu yang mengintegrasikan pendidikan akademik, karakter, dan tahfidz Al-Qur\'an.',
                'email' => 'info@nurulhikmah.sch.id',
                'phone' => '02112345678',
                'whatsapp' => '6281234567890',
                'address' => 'Jl. Pendidikan No. 1',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'postal_code' => '12345',
                'vision' => 'Menjadi sekolah Islam unggulan yang menghasilkan generasi berilmu dan berakhlak.',
                'mission' => 'Menyelenggarakan pendidikan berkualitas berbasis Al-Qur\'an dan Sunnah.',
                'social_media' => [
                    'instagram' => '@nurulhikmah',
                    'youtube' => 'NurulHikmahOfficial',
                ],
                'seo' => [
                    'title' => 'Sekolah Islam Nurul Hikmah',
                    'description' => 'Pendidikan Islam terpadu untuk masa depan gemilang.',
                ],
                'is_active' => true,
            ],
        );

        HeroSlider::query()->updateOrCreate(
            ['school_id' => $school->id, 'title' => 'Selamat Datang di Nurul Hikmah'],
            [
                'subtitle' => 'Pendidikan Islam Terpadu',
                'image' => '/images/hero-1.jpg',
                'cta_text' => 'Daftar Sekarang',
                'cta_url' => '/pmb',
                'order' => 1,
                'is_active' => true,
            ],
        );

        Curriculum::query()->updateOrCreate(
            ['slug' => 'kurikulum-tahfidz'],
            [
                'school_id' => $school->id,
                'title' => 'Program Tahfidz',
                'excerpt' => 'Program hafalan Al-Qur\'an terstruktur.',
                'content' => 'Siswa dibimbing menghafal Al-Qur\'an dengan metode terbukti.',
                'icon' => 'book-quran',
                'category' => 'tahfidz',
                'order' => 1,
                'is_active' => true,
                'is_featured' => true,
            ],
        );

        Teacher::query()->updateOrCreate(
            ['slug' => 'ustadz-ahmad'],
            [
                'school_id' => $school->id,
                'name' => 'Ustadz Ahmad Fauzi',
                'title' => 'Guru Tahfidz',
                'subject' => 'Tahfidz',
                'bio' => 'Pengajar tahfidz berpengalaman lebih dari 10 tahun.',
                'order' => 1,
                'is_active' => true,
                'is_featured' => true,
            ],
        );

        StudentActivity::query()->updateOrCreate(
            ['slug' => 'lomba-tahfidz-2026'],
            [
                'school_id' => $school->id,
                'title' => 'Lomba Tahfidz Sekolah 2026',
                'excerpt' => 'Kompetisi tahfidz antar kelas.',
                'content' => 'Siswa berkompetisi menghafal dan mempresentasikan ayat pilihan.',
                'category' => 'akademik',
                'activity_date' => now()->subDays(7)->toDateString(),
                'order' => 1,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now()->subDays(7),
            ],
        );

        $facility = Facility::query()->updateOrCreate(
            ['slug' => 'masjid-sekolah'],
            [
                'school_id' => $school->id,
                'name' => 'Masjid Sekolah',
                'description' => 'Masjid luas untuk kegiatan ibadah dan pembelajaran agama.',
                'category' => 'ibadah',
                'order' => 1,
                'is_active' => true,
                'is_featured' => true,
            ],
        );

        FacilityPhoto::query()->updateOrCreate(
            ['facility_id' => $facility->id, 'path' => '/images/facilities/masjid-1.jpg'],
            [
                'caption' => 'Tampak depan masjid',
                'order' => 1,
                'is_active' => true,
            ],
        );

        News::query()->updateOrCreate(
            ['slug' => 'pembukaan-pmb-2026'],
            [
                'school_id' => $school->id,
                'user_id' => $admin->id,
                'title' => 'Pembukaan PMB Tahun Ajaran 2026/2027',
                'excerpt' => 'Pendaftaran peserta didik baru telah dibuka.',
                'content' => 'Segera daftarkan putra-putri Anda melalui formulir pendaftaran online.',
                'category' => 'pengumuman',
                'status' => 'published',
                'order' => 1,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now(),
            ],
        );

        Testimonial::query()->updateOrCreate(
            ['school_id' => $school->id, 'name' => 'Ibu Siti Aminah'],
            [
                'role' => 'Orang Tua Siswa',
                'content' => 'Anak saya semakin rajin belajar dan menghafal Al-Qur\'an sejak bersekolah di Nurul Hikmah.',
                'rating' => 5,
                'order' => 1,
                'is_active' => true,
                'is_featured' => true,
            ],
        );

        Setting::query()->updateOrCreate(
            ['school_id' => $school->id, 'group' => 'general', 'key' => 'site_name'],
            [
                'value' => 'Sekolah Islam Nurul Hikmah',
                'type' => 'string',
            ],
        );

        Setting::query()->updateOrCreate(
            ['school_id' => $school->id, 'group' => 'pmb', 'key' => 'is_open'],
            [
                'value' => 'true',
                'type' => 'boolean',
            ],
        );
    }
}
