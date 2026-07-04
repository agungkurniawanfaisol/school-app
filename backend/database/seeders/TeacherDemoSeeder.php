<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\Teacher;
use Database\Seeders\Concerns\SeedsTeacherProfiles;
use Illuminate\Database\Seeder;

class TeacherDemoSeeder extends Seeder
{
    use SeedsTeacherProfiles;

    public function run(): void
    {
        $school = School::query()->where('slug', 'nurul-hikmah')->firstOrFail();

        $teachers = [
            ['slug' => 'ustadz-ahmad-fauzi', 'name' => 'Ustadz Ahmad Fauzi', 'title' => 'Koordinator Tahfidz', 'subject' => 'Tahfidz', 'featured' => true, 'type' => 'guru'],
            ['slug' => 'ustadzah-siti-nurhaliza', 'name' => 'Ustadzah Siti Nurhaliza', 'title' => 'Guru Bahasa Arab', 'subject' => 'Bahasa Arab', 'featured' => true, 'type' => 'guru'],
            ['slug' => 'bu-dewi-lestari', 'name' => 'Bu Dewi Lestari, S.Pd.', 'title' => 'Wali Kelas 6', 'subject' => 'Matematika', 'featured' => true, 'type' => 'guru'],
            ['slug' => 'pak-budi-santoso', 'name' => 'Pak Budi Santoso, M.Pd.', 'title' => 'Guru IPA', 'subject' => 'IPA', 'featured' => true, 'type' => 'guru'],
            ['slug' => 'ustadz-rizki-pratama', 'name' => 'Ustadz Rizki Pratama', 'title' => 'Guru PAI', 'subject' => 'Pendidikan Agama Islam', 'featured' => true, 'type' => 'guru'],
            ['slug' => 'bu-ani-wulandari', 'name' => 'Bu Ani Wulandari, S.Pd.', 'title' => 'Guru Bahasa Indonesia', 'subject' => 'Bahasa Indonesia', 'featured' => false, 'type' => 'guru'],
            ['slug' => 'pak-fajar-nugroho', 'name' => 'Pak Fajar Nugroho', 'title' => 'Guru Olahraga', 'subject' => 'PJOK', 'featured' => false, 'type' => 'guru'],
            ['slug' => 'ustadzah-maryam-hanif', 'name' => 'Ustadzah Maryam Hanif', 'title' => 'Guru Tahfidz', 'subject' => 'Tahfidz', 'featured' => false, 'type' => 'guru'],
            ['slug' => 'bu-rina-kartika', 'name' => 'Bu Rina Kartika, S.Pd.', 'title' => 'Guru IPS', 'subject' => 'IPS', 'featured' => false, 'type' => 'guru'],
            ['slug' => 'bu-maya-sari', 'name' => 'Bu Maya Sari, M.Pd.', 'title' => 'Koordinator Kurikulum', 'subject' => 'Kurikulum', 'featured' => true, 'type' => 'guru'],

            ['slug' => 'h-muhammad-ridwan', 'name' => 'H. Muhammad Ridwan, M.Pd.I.', 'title' => 'Kepala Sekolah', 'subject' => null, 'featured' => true, 'type' => 'kepala_sekolah'],

            ['slug' => 'ibu-sri-wahyuni', 'name' => 'Ibu Sri Wahyuni', 'title' => 'Kepala Tata Usaha', 'subject' => null, 'featured' => false, 'type' => 'staff'],
            ['slug' => 'pak-hendra-wijaya', 'name' => 'Pak Hendra Wijaya', 'title' => 'Staf Keuangan', 'subject' => null, 'featured' => false, 'type' => 'staff'],
            ['slug' => 'bu-ratna-sari', 'name' => 'Bu Ratna Sari', 'title' => 'Staf Administrasi', 'subject' => null, 'featured' => false, 'type' => 'staff'],
            ['slug' => 'pak-dimas-prasetyo', 'name' => 'Pak Dimas Prasetyo', 'title' => 'Staf Perpustakaan', 'subject' => null, 'featured' => false, 'type' => 'staff'],
        ];

        foreach ($teachers as $i => $teacher) {
            $profile = $this->teacherRichProfile($teacher['name'], $teacher['subject'] ?? $teacher['title'], $teacher['title']);

            Teacher::query()->updateOrCreate(
                ['slug' => $teacher['slug']],
                [
                    'school_id' => $school->id,
                    'type' => $teacher['type'],
                    'name' => $teacher['name'],
                    'title' => $teacher['title'],
                    'subject' => $teacher['subject'],
                    'bio' => $profile['bio'],
                    'content' => $profile['content'],
                    'content_json' => $profile['content_json'],
                    'photo' => $this->teacherAvatarUrl($teacher['name']),
                    'email' => str_replace('-', '.', $teacher['slug']).'@nurulhikmah.sch.id',
                    'social_media' => [
                        'instagram' => '@'.$teacher['slug'],
                        'youtube' => 'NurulHikmah'.str_replace('-', '', ucwords($teacher['slug'], '-')),
                    ],
                    'order' => $i,
                    'is_active' => true,
                    'is_featured' => $teacher['featured'],
                ],
            );
        }
    }
}
