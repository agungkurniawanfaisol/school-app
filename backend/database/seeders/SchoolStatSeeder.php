<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\SchoolStat;
use Illuminate\Database\Seeder;

class SchoolStatSeeder extends Seeder
{
    public function run(): void
    {
        $school = School::query()->where('slug', 'nurul-hikmah')->first()
            ?? School::query()->orderBy('id')->first();

        if (! $school) {
            return;
        }

        $stats = [
            [
                'icon' => 'graduation-cap',
                'label' => 'Berdiri',
                'value' => '1998',
                'order' => 1,
            ],
            [
                'icon' => 'users',
                'label' => 'Siswa',
                'value' => '500+',
                'order' => 2,
            ],
            [
                'icon' => 'book-open',
                'label' => 'Jenjang',
                'value' => 'TK–SMP',
                'order' => 3,
            ],
        ];

        foreach ($stats as $stat) {
            SchoolStat::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'label' => $stat['label'],
                ],
                [
                    'icon' => $stat['icon'],
                    'value' => $stat['value'],
                    'order' => $stat['order'],
                    'is_active' => true,
                ],
            );
        }
    }
}
