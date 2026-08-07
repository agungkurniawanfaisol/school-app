<?php

namespace Database\Seeders;

use App\Models\AppRelease;
use Illuminate\Database\Seeder;

class AppReleaseSeeder extends Seeder
{
    public function run(): void
    {
        AppRelease::query()->firstOrCreate(
            ['version' => '1.0.0'],
            [
                'title' => 'Rilis awal',
                'body' => "• Versioning aplikasi aktif\n• Notifikasi update otomatis\n• Riwayat perubahan di /riwayat-versi",
                'is_published' => true,
                'published_at' => now(),
            ],
        );
    }
}
