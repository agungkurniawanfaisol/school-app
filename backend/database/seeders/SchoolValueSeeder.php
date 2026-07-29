<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\SchoolValue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class SchoolValueSeeder extends Seeder
{
    public function run(): void
    {
        $school = School::query()->where('slug', 'nurul-hikmah')->first()
            ?? School::query()->orderBy('id')->first();

        if (! $school) {
            return;
        }

        $values = [
            [
                'icon' => 'heart',
                'title' => 'Akhlak',
                'description' => 'Membentuk karakter mulia berdasarkan Al-Quran dan Sunnah.',
                'order' => 1,
            ],
            [
                'icon' => 'sparkles',
                'title' => 'Ilmu',
                'description' => 'Menguasai ilmu pengetahuan dengan semangat belajar sepanjang hayat.',
                'order' => 2,
            ],
            [
                'icon' => 'hand-heart',
                'title' => 'Amal',
                'description' => 'Mengamalkan ilmu untuk kemaslahatan umat dan bangsa.',
                'order' => 3,
            ],
            [
                'icon' => 'target',
                'title' => 'Ukhuwah',
                'description' => 'Membangun persaudaraan yang kuat dalam keberagaman.',
                'order' => 4,
            ],
        ];

        foreach ($values as $value) {
            SchoolValue::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'title' => $value['title'],
                ],
                [
                    'icon' => $value['icon'],
                    'description' => $value['description'],
                    'order' => $value['order'],
                    'is_active' => true,
                ],
            );
        }

        Cache::forget('landing_page_data');
    }
}
