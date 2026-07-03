<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;

class SchoolAboutSeeder extends Seeder
{
    public function run(): void
    {
        School::query()->updateOrCreate(
            ['slug' => 'nurul-hikmah'],
            [
                'name' => 'Sekolah Islam Nurul Hikmah',
                'tagline' => 'Membentuk Generasi Qurani & Berakhlak Mulia',
                'logo' => '/logo.png',
                'favicon' => '/favicon.png',
                'description' => 'Sekolah Islam Nurul Hikmah berdiri sejak 1998 sebagai lembaga pendidikan terpadu yang mengintegrasikan kurikulum nasional, program tahfidz Al-Qur\'an, dan pembinaan karakter Islami. Kami melayani jenjang TK, SD, dan SMP dengan fasilitas modern, guru berpengalaman, serta lingkungan belajar yang aman dan penuh kasih sayang. Setiap siswa dibimbing untuk unggul secara akademik, mandiri secara spiritual, dan peduli terhadap sesama melalui program AMAL (Akhlak, Ilmu, Amal) sekolah.',
                'email' => 'info@nurulhikmah.sch.id',
                'phone' => '02112345678',
                'whatsapp' => '6281234567890',
                'address' => 'Jl. Pendidikan Islam No. 1, Kebayoran Lama',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'postal_code' => '12240',
                'latitude' => -6.2432000,
                'longitude' => 106.7833000,
                'vision' => 'Menjadi sekolah Islam unggulan yang menghasilkan generasi berilmu, berakhlak mulia, hafal Al-Qur\'an, dan siap berkontribusi bagi umat serta bangsa.',
                'mission' => "1. Menyelenggarakan pendidikan berkualitas berbasis Al-Qur'an dan Sunnah dengan kurikulum terintegrasi.\n2. Membina karakter siswa melalui pembiasaan ibadah, adab, dan kepemimpinan Islami.\n3. Mengembangkan potensi akademik, tahfidz, bahasa, dan keterampilan abad 21 secara seimbang.\n4. Menjalin kemitraan aktif dengan orang tua dan masyarakat dalam pendidikan anak.\n5. Menciptakan lingkungan belajar yang aman, inklusif, dan inspiratif bagi seluruh warga sekolah.",
                'social_media' => [
                    'instagram' => '@nurulhikmah.sch.id',
                    'youtube' => 'NurulHikmahOfficial',
                    'facebook' => 'NurulHikmahSchool',
                    'tiktok' => '@nurulhikmah.sch.id',
                ],
                'seo' => [
                    'title' => 'Sekolah Islam Nurul Hikmah — Pendidikan Islam Terpadu Jakarta',
                    'description' => 'Sekolah Islam terpadu di Jakarta Selatan. Program tahfidz, akademik unggul, fasilitas lengkap, dan pendaftaran siswa baru online.',
                ],
                'is_active' => true,
            ],
        );
    }
}
