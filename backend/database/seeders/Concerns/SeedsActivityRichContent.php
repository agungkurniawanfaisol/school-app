<?php

namespace Database\Seeders\Concerns;

trait SeedsActivityRichContent
{
    use SeedsRichContentBlocks;

    /**
     * @return array<string, array{content: null, content_json: array<string, mixed>, thumbnail: string}>
     */
    protected function activityRichProfiles(): array
    {
        return [
            'lomba-tahfidz-2026' => $this->richLombaTahfidz(),
            'bakti-sosial-ramadhan' => $this->richBaktiSosial(),
            'study-tour-museum' => $this->richStudyTourMuseum(),
            'festival-seni-islam' => $this->richFestivalSeni(),
            'olimpiade-matematika' => $this->richOlimpiadeMatematika(),
            'pramuka-persiapan-giat' => $this->richPramukaGiat(),
            'giat-pramuka-perkemahan' => $this->genericRichStoryProfile(
                'Giat Pramuka Perkemahan Akhir Tahun',
                'Pramuka penggalang menjalani perkemahan tiga hari dua malam dengan materi leadership, survival, dan kepedulian lingkungan.',
                self::IMG_SCOUTING,
                [
                    'Pembukaan api unggun & yel-yel regu',
                    'Kompetisi tali temali & pioneering',
                    'Jelajah alam & orientasi kompas',
                    'Penutupan & penyerahan penghargaan regu',
                ],
                '0SPC_QXRQac',
            ),
            'kompetisi-kaligrafi' => $this->genericRichStoryProfile(
                'Kompetisi Kaligrafi Islam',
                'Siswa SD dan SMP memamerkan karya kaligrafi khat naskhi dan diwani dalam pameran terbuka di aula sekolah.',
                self::IMG_MUSIC,
                [
                    'Kategori SD: surat pendek & ayat pilihan',
                    'Kategori SMP: hadits & asmaul husna',
                    'Penjurian oleh ustadz kaligrafi mitra',
                    'Pameran karya terbaik selama satu minggu',
                ],
                'TjPFZaMe2yw',
            ),
            'senam-sehat-bersama' => $this->genericRichStoryProfile(
                'Senam Sehat & Gizi Bersama',
                'Seluruh warga sekolah mengikuti senam pagi bersama ahli gizi untuk mempromosikan hidup sehat dan semangat belajar.',
                self::IMG_STUDENTS,
                [
                    'Senam anak & remaja bersama instruktur',
                    'Edukasi gizi seimbang di kantin sehat',
                    'Pengukuran IMT siswa sampel',
                    'Kompetisi menu sehat antar kelas',
                ],
                'k5u1P9lZ-p4',
            ),
            'bakti-lingkungan-harian' => $this->genericRichStoryProfile(
                'Gerakan Peduli Lingkungan Sekolah',
                'Program rutin Jumat bersih: siswa, guru, dan petugas kebersihan berkolaborasi merapikan taman, kelas, dan area musholla.',
                self::IMG_CHARITY,
                [
                    'Pemilahan sampah organik & anorganik',
                    'Penyiraman tanaman taman sekolah',
                    'Edukasi eco-school 15 menit per kelas',
                    'Laporan progres ke komite sekolah',
                ],
                'QS09gxVhauQ',
            ),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richLombaTahfidz(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_QURAN,
            'content_json' => $this->doc([
                $this->h2('Gemuruh Tilawah di Aula Utama'),
                $this->p([
                    $this->t('Suasana '),
                    $this->bold('Lomba Tahfidz Sekolah 2026'),
                    $this->t(' dipenuhi semangat dan doa. Ratusan siswa SD & SMP menampilkan hafalan terbaik mereka di hadapan juri ustadz/ustadzah berpengalaman.'),
                ]),
                $this->img(self::IMG_QURAN, 'Siswa membawa mushaf saat lomba tahfidz', 'center'),
                $this->cols([
                    [
                        $this->img(self::IMG_STUDENTS, 'Peserta putra sedang setoran', 'center'),
                    ],
                    [
                        $this->img(self::IMG_CLASSROOM, 'Juri menilai makhraj dan tajwid', 'center'),
                    ],
                ]),
                $this->h3('Kategori Lomba'),
                $this->ol([
                    [$this->bold('Tilawah Anak'), $this->t(' — 1 Juz (SD kelas 4–6)')],
                    [$this->bold('Tahfidz Remaja'), $this->t(' — 3 Juz (SMP kelas 7–8)')],
                    [$this->bold('Muroja\'ah Cepat'), $this->t(' — Surat pilihan 10 menit')],
                    [$this->bold('Hifdzil Qur\'an'), $this->t(' — Hafalan bebas + tafsir ringkas')],
                ]),
                $this->blockquote('“Setiap ayat yang dilantunkan adalah benih cahaya untuk masa depan mereka.” — Pembina Tahfidz'),
                $this->h3('Momen Terbaik'),
                $this->yt('QS09gxVhauQ'),
                $this->p([
                    $this->italic('Rekaman cuplikan lomba dan reaksi penuh haru dari orang tua pendamping.'),
                ], 'center'),
                $this->cols([
                    [
                        $this->p([$this->bold('126'), $this->t(' peserta')], 'center'),
                    ],
                    [
                        $this->p([$this->bold('12'), $this->t(' juri & dewan hakim')], 'center'),
                    ],
                    [
                        $this->p([$this->bold('4'), $this->t(' jam kompetisi')], 'center'),
                    ],
                ]),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richBaktiSosial(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_CHARITY,
            'content_json' => $this->doc([
                $this->h2('Berbagi Keberkahan di Bulan Suci'),
                $this->p([
                    $this->t('Dalam semangat '),
                    $this->bold('Ramadhan penuh berkah'),
                    $this->t(', siswa Nurul Hikmah menggelar bakti sosial menyalurkan sembako dan paket berbuka ke warga sekitar sekolah.'),
                ]),
                $this->img(self::IMG_CHARITY, 'Siswa membagi paket sembako', 'center'),
                $this->cols([
                    [
                        $this->img(self::IMG_STUDENTS, 'Tim relawan siswa SMP', 'center'),
                        $this->p([$this->t('Relawan siap berangkat')], 'center'),
                    ],
                    [
                        $this->img(self::IMG_GRADUATION, 'Penyerahan bantuan ke warga', 'center'),
                        $this->p([$this->t('Senyum penerima bantuan')], 'center'),
                    ],
                ]),
                $this->h3('Yang Kami Salurkan'),
                $this->ol([
                    [$this->bold('250'), $this->t(' paket sembako (beras, minyak, gula, teh)')],
                    [$this->bold('180'), $this->t(' paket berbuka anak-anak')],
                    [$this->bold('35'), $this->t(' kitab & mushaf untuk pengajian lingkungan')],
                    [$this->t('Donasi tunai hasil '),
                    $this->italic('charity walk'),
                    $this->t(' siswa sebesar Rp12.500.000')],
                ]),
                $this->hr(),
                $this->h3('Video Dokumentasi'),
                $this->yt('k5u1P9lZ-p4'),
                $this->blockquote('“Anak-anak belajar bahwa ilmu dan rezeki paling indah adalah yang dibagi.” — Ketua OSIS'),
                $this->p([
                    $this->t('Terima kasih kepada orang tua dan donatur yang telah mempercayakan amanah ini. '),
                    $this->link('Hubungi humas', '/kontak'),
                    $this->t(' untuk ikut program berikutnya.'),
                ]),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richStudyTourMuseum(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_MUSEUM,
            'content_json' => $this->doc([
                $this->h2('Menjelajah Sejarah, Menumbuhkan Cinta Tanah Air'),
                $this->p([
                    $this->t('Kelas 5 berangkat ke '),
                    $this->bold('Museum Nasional'),
                    $this->t(' dengan penuh rasa ingin tahu. Mereka belajar sejarah bangsa sambil mengamati artefak berabad-abad.'),
                ]),
                $this->img(self::IMG_MUSEUM, 'Siswa mengamati koleksi museum', 'center'),
                $this->cols([
                    [
                        $this->img(self::IMG_EXCURSION, 'Guru mendampingi di halaman museum', 'center'),
                    ],
                    [
                        $this->img(self::IMG_CLASSROOM, 'Siswa mencatat di buku eksplorasi', 'center'),
                    ],
                ]),
                $this->h3('Stasiun Belajar'),
                $this->ol([
                    'Ruang Arca & Prasasti — mengenal kerajaan Nusantara',
                    'Ruang Kemerdekaan — simbol perjuangan bangsa',
                    'Workshop mini membuat prasasti dari tanah liat',
                    'Kuis interaktif “Petualang Sejarah” berhadiah pin',
                ]),
                $this->h3('Cuplikan Perjalanan'),
                $this->yt('TjPFZaMe2yw'),
                $this->video(self::VIDEO_SAMPLE, self::IMG_MUSEUM),
                $this->blockquote('“Mata mereka berbinar saat melihat replika perahu kuno — momen yang tak terlupakan!” — Wali kelas 5A'),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richFestivalSeni(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_MUSIC,
            'content_json' => $this->doc([
                $this->h2('Panggung Gemilang Seni Islam'),
                $this->p([
                    $this->t('Aula serba guna berubah menjadi '),
                    $this->bold('panggung spektakuler'),
                    $this->t(': nasyid berirama, kaligrafi penuh makna, dan pidato bahasa Arab yang memukau.'),
                ]),
                $this->img(self::IMG_MUSIC, 'Pentas nasyid siswa', 'center'),
                $this->cols([
                    [
                        $this->img(self::IMG_STUDENTS, 'Grup nasyid SMP', 'center'),
                    ],
                    [
                        $this->img(self::IMG_WORKSHOP, 'Pameran kaligrafi karya siswa', 'center'),
                    ],
                    [
                        $this->img(self::IMG_GRADUATION, 'Penampilan pidato bahasa Arab', 'center'),
                    ],
                ]),
                $this->h3('Penghargaan Utama'),
                $this->ol([
                    [$this->bold('Juara Nasyid'), $this->t(' — Kelompok An-Nur (SMP)')],
                    [$this->bold('Juara Kaligrafi'), $this->t(' — Fatimah Azzahra (Kelas 6)')],
                    [$this->bold('Juara MC Berbahasa Arab'), $this->t(' — Ahmad Rizki (Kelas 8)')],
                    [$this->bold('Penampilan Terfavorit'), $this->t(' — Paduan suara SD')],
                ]),
                $this->h3('Rekaman Pentas'),
                $this->yt('ayXxwJJId_c'),
                $this->blockquote('“Seni yang indah adalah seni yang mendekatkan hati kepada Allah.” — Pembina kesenian'),
                $this->p([
                    $this->t('Festival ini dihadiri lebih dari '),
                    $this->bold('400 orang tua'),
                    $this->t(' dan menjadi agenda tahunan yang dinanti.'),
                ], 'center'),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richOlimpiadeMatematika(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_SCIENCE,
            'content_json' => $this->doc([
                $this->h2('Otak-Otak Cemerlang Bersaing'),
                $this->p([
                    $this->t('Olimpiade Matematika Internal menjadi '),
                    $this->bold('ajang seleksi'),
                    $this->t(' bagi siswa berprestasi untuk mewakili sekolah di kompetisi tingkat kota dan provinsi.'),
                ]),
                $this->img(self::IMG_SCIENCE, 'Siswa mengerjakan soal olimpiade', 'center'),
                $this->cols([
                    [
                        $this->img(self::IMG_CLASSROOM, 'Ruang kompetisi SD', 'center'),
                    ],
                    [
                        $this->img(self::IMG_STUDENTS, 'Diskusi strategi pasca-lomba', 'center'),
                    ],
                ]),
                $this->h3('Tahapan Seleksi'),
                $this->ol([
                    'Pre-test online — 500 siswa terdaftar',
                    'Babak penyisihan — 80 finalis terpilih',
                    'Final SD & SMP — 30 menit, 20 soal HOTS',
                    'Pembinaan intensif 2 minggu untuk 6 delegasi kota',
                ]),
                $this->h3('Tips dari Juara'),
                $this->ul([
                    'Latih soal cerita setiap hari, bukan hanya rumus',
                    'Biasakan menulis langkah kerja rapi agar mudah dicek',
                    'Jaga stamina — tidur cukup sebelum hari-H',
                ]),
                $this->yt('inpok4MKVLM'),
                $this->blockquote('“Matematika mengajarkan kita sabar, teliti, dan tidak menyerah.” — Koordinator OSN'),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richPramukaGiat(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_SCOUTING,
            'content_json' => $this->doc([
                $this->h2('Siap Tempur di Alam Terbuka!'),
                $this->p([
                    $this->t('Pramuka penggalang Nurul Hikmah memasuki '),
                    $this->bold('pekan latihan intensif'),
                    $this->t(' menjelang Giat Pramuka. Api unggun, tenda, dan tali temali menjadi sahabat sehari-hari.'),
                ]),
                $this->img(self::IMG_SCOUTING, 'Perkemahan pramuka di kawasan hijau', 'center'),
                $this->cols([
                    [
                        $this->img(self::IMG_EXCURSION, 'Latihan tenda berjamaah', 'center'),
                    ],
                    [
                        $this->img(self::IMG_STUDENTS, 'Navigasi dan peta kompas', 'center'),
                    ],
                ]),
                $this->h3('Materi Latihan'),
                $this->ol([
                    'Survival dasar & P3K di alam terbuka',
                    'Tali temali — 12 simpul wajib lulus',
                    'Leadership camp & pembagian tugas regu',
                    'Pramuka berwirausaha — bazar kreatif regu',
                    'Apel kesiapan & simulasi keadaan darurat',
                ]),
                $this->h3('Semangat di Lapangan'),
                $this->yt('0SPC_QXRQac'),
                $this->video(self::VIDEO_SAMPLE, self::IMG_SCOUTING),
                $this->cols([
                    [
                        $this->p([$this->bold('72'), $this->t(' pramuka penggalang')], 'center'),
                    ],
                    [
                        $this->p([$this->bold('3'), $this->t(' malam berkemah')], 'center'),
                    ],
                ]),
                $this->blockquote('“Di sini anak-anak belajar mandiri, disiplin, dan saling membantu seperti keluarga.” — Kakak Pembina'),
            ]),
        ];
    }
}
