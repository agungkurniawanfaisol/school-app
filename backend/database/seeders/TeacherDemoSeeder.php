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
            ['slug' => 'ustadz-ahmad-fauzi', 'name' => 'Ustadz Ahmad Fauzi', 'title' => 'Koordinator Tahfidz', 'subject' => 'Tahfidz', 'featured' => true],
            ['slug' => 'ustadzah-siti-nurhaliza', 'name' => 'Ustadzah Siti Nurhaliza', 'title' => 'Guru Bahasa Arab', 'subject' => 'Bahasa Arab', 'featured' => true],
            ['slug' => 'bu-dewi-lestari', 'name' => 'Bu Dewi Lestari, S.Pd.', 'title' => 'Wali Kelas 6', 'subject' => 'Matematika', 'featured' => true],
            ['slug' => 'pak-budi-santoso', 'name' => 'Pak Budi Santoso, M.Pd.', 'title' => 'Guru IPA', 'subject' => 'IPA', 'featured' => true],
            ['slug' => 'ustadz-rizki-pratama', 'name' => 'Ustadz Rizki Pratama', 'title' => 'Guru PAI', 'subject' => 'Pendidikan Agama Islam', 'featured' => true],
            ['slug' => 'bu-ani-wulandari', 'name' => 'Bu Ani Wulandari, S.Pd.', 'title' => 'Guru Bahasa Indonesia', 'subject' => 'Bahasa Indonesia', 'featured' => false],
            ['slug' => 'pak-fajar-nugroho', 'name' => 'Pak Fajar Nugroho', 'title' => 'Guru Olahraga', 'subject' => 'PJOK', 'featured' => false],
            ['slug' => 'ustadzah-maryam-hanif', 'name' => 'Ustadzah Maryam Hanif', 'title' => 'Guru Tahfidz', 'subject' => 'Tahfidz', 'featured' => false],
            ['slug' => 'bu-rina-kartika', 'name' => 'Bu Rina Kartika, S.Pd.', 'title' => 'Guru IPS', 'subject' => 'IPS', 'featured' => false],
            ['slug' => 'pak-doni-prasetya', 'name' => 'Pak Doni Prasetya', 'title' => 'Guru Seni Budaya', 'subject' => 'Seni Budaya', 'featured' => false],
            ['slug' => 'ustadz-hasan-basri', 'name' => 'Ustadz Hasan Basri', 'title' => 'Guru Akidah Akhlak', 'subject' => 'Akidah Akhlak', 'featured' => false],
            ['slug' => 'bu-maya-sari', 'name' => 'Bu Maya Sari, M.Pd.', 'title' => 'Koordinator Kurikulum', 'subject' => 'Kurikulum', 'featured' => true],
            ['slug' => 'pak-eko-widodo', 'name' => 'Pak Eko Widodo', 'title' => 'Guru Informatika', 'subject' => 'Informatika', 'featured' => false],
            ['slug' => 'ustadzah-fatimah-az-zahra', 'name' => 'Ustadzah Fatimah Az-Zahra', 'title' => 'Guru Fiqih', 'subject' => 'Fiqih', 'featured' => false],
            ['slug' => 'bu-larasati-indira', 'name' => 'Bu Larasati Indira', 'title' => 'Guru Bahasa Inggris', 'subject' => 'Bahasa Inggris', 'featured' => false],
            ['slug' => 'pak-yusuf-ramadhan', 'name' => 'Pak Yusuf Ramadhan', 'title' => 'Guru Pramuka', 'subject' => 'Pramuka', 'featured' => false],
            ['slug' => 'ustadz-ibrahim-syafei', 'name' => 'Ustadz Ibrahim Syafei', 'title' => 'Musyrif Asrama', 'subject' => 'Pembinaan Asrama', 'featured' => false],
            ['slug' => 'bu-putri-ayu', 'name' => 'Bu Putri Ayu, S.Psi.', 'title' => 'Guru BK', 'subject' => 'Bimbingan Konseling', 'featured' => false],
            ['slug' => 'pak-agung-saputra', 'name' => 'Pak Agung Saputra', 'title' => 'Guru TIK', 'subject' => 'Teknologi Informasi', 'featured' => false],
            ['slug' => 'ustadzah-khadijah-rahma', 'name' => 'Ustadzah Khadijah Rahma', 'title' => 'Guru Al-Qur\'an Hadits', 'subject' => 'Al-Qur\'an Hadits', 'featured' => false],
            ['slug' => 'bu-siska-melati', 'name' => 'Bu Siska Melati', 'title' => 'Guru Kelas 1', 'subject' => 'Kelas Awal', 'featured' => false],
            ['slug' => 'pak-hendra-gunawan', 'name' => 'Pak Hendra Gunawan, M.Pd.', 'title' => 'Wali Kelas 9', 'subject' => 'Matematika', 'featured' => false],
            ['slug' => 'ustadz-muhammad-hanif', 'name' => 'Ustadz Muhammad Hanif', 'title' => 'Guru Tahsin', 'subject' => 'Tahsin', 'featured' => false],
            ['slug' => 'bu-clara-wijaya', 'name' => 'Bu Clara Wijaya', 'title' => 'Guru Seni Musik', 'subject' => 'Seni Musik', 'featured' => false],
        ];

        foreach ($teachers as $i => $teacher) {
            $profile = $this->teacherRichProfile($teacher['name'], $teacher['subject'], $teacher['title']);

            Teacher::query()->updateOrCreate(
                ['slug' => $teacher['slug']],
                [
                    'school_id' => $school->id,
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
                    'order' => $i + 1,
                    'is_active' => true,
                    'is_featured' => $teacher['featured'],
                ],
            );
        }
    }
}
