<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@nurulhikmah.sch.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );

        School::query()->updateOrCreate(
            ['slug' => 'nurul-hikmah'],
            [
                'name' => 'Sekolah Islam Nurul Hikmah',
                'tagline' => 'Membentuk Generasi Qurani & Berakhlak Mulia',
                'logo' => '/logo.png',
                'favicon' => '/favicon.png',
                'description' => 'Sekolah Islam terpadu yang mengintegrasikan pendidikan akademik, pembinaan karakter, dan program tahfidz Al-Qur\'an untuk membentuk generasi unggul.',
                'email' => 'info@nurulhikmah.sch.id',
                'phone' => '02112345678',
                'whatsapp' => '6281234567890',
                'address' => 'Jl. Pendidikan Islam No. 1, Kebayoran Lama',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'postal_code' => '12240',
                'latitude' => -6.2432000,
                'longitude' => 106.7833000,
                'vision' => 'Menjadi sekolah Islam unggulan yang menghasilkan generasi berilmu, berakhlak mulia, dan siap berkontribusi bagi umat.',
                'mission' => "1. Menyelenggarakan pendidikan berkualitas berbasis Al-Qur'an dan Sunnah.\n2. Membina karakter siswa melalui pembiasaan ibadah dan akhlak.\n3. Mengembangkan potensi akademik dan non-akademik secara seimbang.",
                'social_media' => [
                    'instagram' => '@nurulhikmah.sch.id',
                    'youtube' => 'NurulHikmahOfficial',
                    'facebook' => 'NurulHikmahSchool',
                ],
                'seo' => [
                    'title' => 'Sekolah Islam Nurul Hikmah — Pendidikan Islam Terpadu',
                    'description' => 'Sekolah Islam terpadu di Jakarta Selatan. Program tahfidz, akademik unggul, dan pendaftaran siswa baru online.',
                ],
                'is_active' => true,
            ],
        );

        $this->call(DemoContentSeeder::class);

        $teacher = Teacher::query()->orderBy('id')->first();

        User::query()->updateOrCreate(
            ['email' => 'guru@nurulhikmah.sch.id'],
            [
                'name' => 'Ustadz Ahmad Fauzi',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'is_active' => true,
                'teacher_id' => $teacher?->id,
                'email_verified_at' => now(),
            ],
        );

        Artisan::call('cache:clear');
    }
}
