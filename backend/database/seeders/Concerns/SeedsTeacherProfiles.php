<?php

namespace Database\Seeders\Concerns;

trait SeedsTeacherProfiles
{
    /**
     * @return array{bio: string, content: string, content_json: array<string, mixed>}
     */
    protected function teacherRichProfile(string $name, string $subject, string $title): array
    {
        $bio = "{$name} adalah {$title} yang berdedikasi membimbing siswa Nurul Hikmah dalam bidang {$subject}.";

        $content = <<<HTML
<h2>Profil Singkat</h2>
<p>{$name} bergabung dengan Nurul Hikmah dan aktif mengembangkan pembelajaran {$subject} yang menyenangkan serta bermakna bagi siswa.</p>
<h2>Pendidikan &amp; Sertifikasi</h2>
<ul>
<li>S1 Pendidikan — perguruan tinggi negeri</li>
<li>Sertifikasi Pendidik Profesional (PPG)</li>
<li>Pelatihan kurikulum merdeka dan literasi digital</li>
</ul>
<h2>Pengalaman Mengajar</h2>
<p>Membimbing siswa dalam kegiatan akademik, olimpiade, dan program pembinaan karakter. Fokus pada pendekatan personal dan komunikasi aktif dengan orang tua.</p>
<h2>Prestasi &amp; Kontribusi</h2>
<ul>
<li>Pembina tim olimpiade {$subject} tingkat kota</li>
<li>Pengembang materi ajar berbasis proyek</li>
<li>Fasilitator workshop internal guru Nurul Hikmah</li>
</ul>
HTML;

        $contentJson = [
            'type' => 'doc',
            'content' => [
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 2],
                    'content' => [['type' => 'text', 'text' => 'Profil Singkat']],
                ],
                [
                    'type' => 'paragraph',
                    'content' => [[
                        'type' => 'text',
                        'text' => "{$name} bergabung dengan Nurul Hikmah dan aktif mengembangkan pembelajaran {$subject} yang menyenangkan serta bermakna bagi siswa.",
                    ]],
                ],
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 2],
                    'content' => [['type' => 'text', 'text' => 'Pendidikan & Sertifikasi']],
                ],
                [
                    'type' => 'bulletList',
                    'content' => [
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'S1 Pendidikan — perguruan tinggi negeri']]]]],
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Sertifikasi Pendidik Profesional (PPG)']]]]],
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Pelatihan kurikulum merdeka dan literasi digital']]]]],
                    ],
                ],
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 2],
                    'content' => [['type' => 'text', 'text' => 'Pengalaman Mengajar']],
                ],
                [
                    'type' => 'paragraph',
                    'content' => [[
                        'type' => 'text',
                        'text' => 'Membimbing siswa dalam kegiatan akademik, olimpiade, dan program pembinaan karakter. Fokus pada pendekatan personal dan komunikasi aktif dengan orang tua.',
                    ]],
                ],
                [
                    'type' => 'heading',
                    'attrs' => ['level' => 2],
                    'content' => [['type' => 'text', 'text' => 'Prestasi & Kontribusi']],
                ],
                [
                    'type' => 'bulletList',
                    'content' => [
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => "Pembina tim olimpiade {$subject} tingkat kota"]]]]],
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Pengembang materi ajar berbasis proyek']]]]],
                        ['type' => 'listItem', 'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Fasilitator workshop internal guru Nurul Hikmah']]]]],
                    ],
                ],
            ],
        ];

        return [
            'bio' => $bio,
            'content' => $content,
            'content_json' => $contentJson,
        ];
    }

    protected function teacherAvatarUrl(string $name): string
    {
        $encoded = rawurlencode($name);

        return "https://ui-avatars.com/api/?name={$encoded}&size=400&background=14532d&color=ffffff&bold=true";
    }
}
