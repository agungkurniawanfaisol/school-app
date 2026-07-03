<?php

namespace Database\Seeders\Concerns;

trait SeedsNewsRichContent
{
    use SeedsRichContentBlocks;

    /**
     * @return array<string, array{content: null, content_json: array<string, mixed>, thumbnail: string}>
     */
    protected function newsRichProfiles(): array
    {
        return [
            'pembukaan-pmb-2026' => $this->richPmb2026(),
            'prestasi-olimpiade-tahfidz' => $this->richTahfidzPrestasi(),
            'workshop-orang-tua' => $this->richWorkshopOrangTua(),
            'jadwal-ujian-akhir' => $this->richJadwalUjian(),
            'kunjungan-pesantren' => $this->richKunjunganPesantren(),
            'libur-semester-akhir' => $this->genericRichStoryProfile(
                'Libur Semester & Program Pengayaan',
                'Sekolah mengumumkan jadwal libur semester genap beserta program pengayaan opsional bagi siswa yang ingin memperdalam hafalan dan literasi.',
                self::IMG_CAMPUS,
                [
                    'Libur resmi 1–14 Juli 2026',
                    'Program tahfidz intensif pagi (opsional)',
                    'Klub membaca & lomba esai liburan',
                    'Pengumpulan laporan AMAL bulanan',
                ],
                'TjPFZaMe2yw',
            ),
            'pelatihan-guru-kurikulum' => $this->genericRichStoryProfile(
                'Pelatihan Guru Kurikulum Merdeka',
                'Seluruh tenaga pendidik mengikuti workshop internal untuk menyelaraskan perencanaan pembelajaran dengan profil pelajar Pancasila.',
                self::IMG_WORKSHOP,
                [
                    'Sesi desain proyek P5 berbasis masalah',
                    'Penyusunan rubrik penilaian autentik',
                    'Praktik micro teaching berkelompok',
                    'Refleksi implementasi di kelas',
                ],
                'inpok4MKVLM',
            ),
            'penghargaan-adiwiyata' => $this->genericRichStoryProfile(
                'Penghargaan Adiwiyata Tingkat Kota',
                'Nurul Hikmah meraih penghargaan sekolah peduli lingkungan berkat program daur ulang, taman sekolah, dan gerakan bebas sampah plastik.',
                self::IMG_CHARITY,
                [
                    'Bank sampah sekolah aktif sejak 2022',
                    'Penanaman 120 pohon di lingkungan sekolah',
                    'Edukasi eco-school ke seluruh kelas',
                    'Audit lingkungan oleh dinas pendidikan',
                ],
                'QS09gxVhauQ',
            ),
            'program-khatam-quran' => $this->genericRichStoryProfile(
                'Program Khatam Al-Qur\'an Angkatan 2026',
                'Sebanyak 34 siswa dinyatakan khatam 30 juz dalam acara khidmat yang dihadiri orang tua dan tokoh masjid mitra.',
                self::IMG_QURAN,
                [
                    'Prosesi khatam & doa bersama',
                    'Penyerahan ijazah hafalan sekolah',
                    'Sharing tips dari alumni hafidz',
                    'Target angkatan berikutnya: 40 siswa',
                ],
                'ayXxwJJId_c',
            ),
            'hari-pahlawan-sekolah' => $this->genericRichStoryProfile(
                'Peringatan Hari Pahlawan di Sekolah',
                'Siswa mengenang jasa pahlawan melalui lomba pidato, pameran sejarah, dan kirab mini berpakaian daerah.',
                self::IMG_GRADUATION,
                [
                    'Lomba pidato Bahasa Indonesia & Arab',
                    'Pameran tokoh nasional per kelas',
                    'Kirab budaya Nusantara',
                    'Doa bersama untuk pahlawan bangsa',
                ],
                '0SPC_QXRQac',
            ),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richPmb2026(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_CAMPUS,
            'content_json' => $this->doc([
                $this->h2('Pendaftaran Resmi Dibuka!'),
                $this->p([
                    $this->t('Tahun ajaran '),
                    $this->bold('2026/2027'),
                    $this->t(' telah tiba. Nurul Hikmah membuka kesempatan bagi calon siswa untuk bergabung dalam lingkungan belajar yang '),
                    $this->bold('Islami, modern, dan penuh kasih sayang'),
                    $this->t('.'),
                ]),
                $this->img(self::IMG_CAMPUS, 'Gedung Sekolah Islam Nurul Hikmah', 'center'),
                $this->h3('Alur Pendaftaran Online'),
                $this->ol([
                    [$this->t('Kunjungi halaman '), $this->link('PMB Online', '/pmb/daftar'), $this->t(' dan lengkapi formulir.')],
                    [$this->t('Unggah dokumen: KK, akta kelahiran, dan rapor terakhir (format PDF/JPG, maks. 2 MB).')],
                    [$this->t('Bayar biaya pendaftaran melalui virtual account yang dikirim ke email orang tua.')],
                    [$this->t('Ikuti tes seleksi & wawancara sesuai jadwal yang dipilih.')],
                    [$this->t('Pantau status pendaftaran kapan saja melalui portal tracking PMB.')],
                ]),
                $this->hr(),
                $this->h3('Highlight Tahun Lalu'),
                $this->cols([
                    [
                        $this->img(self::IMG_STUDENTS, 'Suasana orientasi siswa baru', 'center'),
                        $this->p([$this->bold('428'), $this->t(' siswa baru diterima')], 'center'),
                    ],
                    [
                        $this->img(self::IMG_CLASSROOM, 'Ruang kelas interaktif', 'center'),
                        $this->p([$this->bold('96%'), $this->t(' orang tua merekomendasikan')], 'center'),
                    ],
                ]),
                $this->h3('Video Profil Sekolah'),
                $this->yt('k5u1P9lZ-p4'),
                $this->p([
                    $this->t('Saksikan cuplikan kegiatan belajar, tahfidz, dan ekstrakurikuler di lingkungan Nurul Hikmah.'),
                ], 'center'),
                $this->h3('Suasana Hari Pertama'),
                $this->video(self::VIDEO_SAMPLE, self::IMG_CAMPUS),
                $this->blockquote('“Memilih sekolah adalah investasi akhirat dan dunia. Kami siap mendampingi setiap langkah anak Anda.” — Kepala Sekolah'),
                $this->p([
                    $this->t('Informasi lengkap: hubungi humas di '),
                    $this->link('WhatsApp resmi', 'https://wa.me/6281234567890'),
                    $this->t(' atau datang langsung ke kantor sekolah Senin–Jumat, 08.00–15.00 WIB.'),
                ]),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richTahfidzPrestasi(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_QURAN,
            'content_json' => $this->doc([
                $this->h2('Medali Emas di Panggung Kota'),
                $this->p([
                    $this->t('Tim tahfidz putra-putri Nurul Hikmah kembali mengharumkan nama sekolah dengan meraih '),
                    $this->bold('Juara 1'),
                    $this->t(' pada Olimpiade Tahfidz tingkat kota.'),
                ]),
                $this->img(self::IMG_QURAN, 'Siswa sedang menghafal Al-Qur\'an', 'center'),
                $this->h3('Pencapaian Tim'),
                $this->ol([
                    [$this->bold('Juara 1'), $this->t(' — Tilawah Putra (Kelas 8)')],
                    [$this->bold('Juara 2'), $this->t(' — Tahfidz 5 Juz Putri (Kelas 7)')],
                    [$this->bold('Juara 3'), $this->t(' — Tahfidz 3 Juz Putra (Kelas 6)')],
                    [$this->t('Penghargaan '),
                    $this->bold('Sekolah Berprestasi'),
                    $this->t(' dari panitia penyelenggara')],
                ]),
                $this->cols([
                    [
                        $this->h3('Latihan Intensif'),
                        $this->ul([
                            'Setoran harian 2 halaman dengan muroja\'ah terjadwal',
                            'Bimbingan tajwid oleh ustadz/ustadzah bersertifikat',
                            'Simulasi lomba setiap pekan menjelang olimpiade',
                        ]),
                    ],
                    [
                        $this->h3('Dukungan Sekolah'),
                        $this->ul([
                            'Beasiswa prestasi untuk finalis tingkat provinsi',
                            'Fasilitas musholla dan ruang hafalan khusus',
                            'Monitoring capaian hafalan via aplikasi orang tua',
                        ]),
                    ],
                ]),
                $this->h3('Rekaman Lomba'),
                $this->yt('QS09gxVhauQ'),
                $this->video(self::VIDEO_SAMPLE, self::IMG_QURAN),
                $this->blockquote('“Alhamdulillah, ini bukti konsistensi anak-anak dan dukungan orang tua. Kami bangga!” — Pembina Tahfidz'),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richWorkshopOrangTua(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_WORKSHOP,
            'content_json' => $this->doc([
                $this->h2('Mendampingi Anak di Era Digital'),
                $this->p([
                    $this->t('Workshop parenting bulan ini menghadirkan '),
                    $this->bold('psikolog pendidikan'),
                    $this->t(' dan praktisi literasi digital untuk membekali orang tua.'),
                ]),
                $this->img(self::IMG_WORKSHOP, 'Sesi diskusi orang tua dan guru', 'center'),
                $this->h3('Agenda Workshop'),
                $this->ol([
                    'Memahami dampak media sosial pada perkembangan remaja',
                    'Menyusun aturan screen time yang realistis di rumah',
                    'Komunikasi efektif saat anak menghadapi cyberbullying',
                    'Praktik monitoring konten dengan tools parental control',
                    'Sesi tanya jawab & konsultasi privat 15 menit',
                ]),
                $this->cols([
                    [
                        $this->img(self::IMG_CLASSROOM, 'Panel diskusi interaktif', 'center'),
                    ],
                    [
                        $this->img(self::IMG_STUDENTS, 'Orang tua berdiskusi kelompok', 'center'),
                    ],
                ]),
                $this->h3('Cuplikan Materi'),
                $this->yt('TjPFZaMe2yw'),
                $this->blockquote('“Orang tua adalah guru pertama. Sekolah dan keluarga harus berjalan seiring.” — Narasumber'),
                $this->p([
                    $this->t('Daftar ulang untuk sesi berikutnya melalui grup WhatsApp komite sekolah.'),
                ], 'center'),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richJadwalUjian(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_CLASSROOM,
            'content_json' => $this->doc([
                $this->h2('Ujian Akhir Semester Genap 2025/2026'),
                $this->p([
                    $this->t('Berikut jadwal resmi ujian akhir semester untuk seluruh jenjang. Mohon '),
                    $this->bold('datang 30 menit'),
                    $this->t(' sebelum ujian dimulai.'),
                ]),
                $this->img(self::IMG_CLASSROOM, 'Siswa mengerjakan ujian', 'center'),
                $this->h3('Jadwal per Jenjang'),
                $this->ol([
                    [$this->bold('SD Kelas 1–3'), $this->t(' — 14–16 Juni 2026')],
                    [$this->bold('SD Kelas 4–6'), $this->t(' — 17–19 Juni 2026')],
                    [$this->bold('SMP Kelas 7–8'), $this->t(' — 21–24 Juni 2026')],
                    [$this->bold('SMP Kelas 9'), $this->t(' — 25–27 Juni 2026 (try out UN & ujian sekolah)')],
                ]),
                $this->h3('Ketentuan Peserta'),
                $this->ul([
                    'Membawa kartu ujian & alat tulis lengkap',
                    'Seragam sekolah rapi, tidak diperkenankan membawa HP',
                    'Sakit berkepanjangan wajib melampirkan surat dokter',
                    'Remedial dijadwalkan 3–5 Juli 2026',
                ]),
                $this->hr(),
                $this->p([
                    $this->t('Unduh jadwal lengkap per mata pelajaran di '),
                    $this->link('portal siswa', '/kursus'),
                    $this->t('.'),
                ]),
            ]),
        ];
    }

    /**
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    private function richKunjunganPesantren(): array
    {
        return [
            'content' => null,
            'thumbnail' => self::IMG_EXCURSION,
            'content_json' => $this->doc([
                $this->h2('Inspirasi Tahfidz di Pesantren Mitra'),
                $this->p([
                    $this->t('Siswa kelas 8 melakukan '),
                    $this->bold('kunjungan edukatif'),
                    $this->t(' ke pesantren mitra untuk memperdalam semangat hafalan dan adab santri.'),
                ]),
                $this->img(self::IMG_EXCURSION, 'Perjalanan study tour siswa', 'center'),
                $this->h3('Rangkaian Kegiatan'),
                $this->ol([
                    'Tour fasilitas asrama, masjid, dan perpustakaan pesantren',
                    'Sesi bersama senior hafidz 30 juz — sharing tips menghafal',
                    'Praktik muroja\'ah berjamaah di masjid pesantren',
                    'Refleksi kelompok: “Apa yang bisa saya terapkan di rumah?”',
                    'Penutupan & doa bersama',
                ]),
                $this->cols([
                    [
                        $this->img(self::IMG_GRADUATION, 'Siswa berfoto bersama di pesantren', 'center'),
                        $this->p([$this->bold('48'), $this->t(' siswa mengikuti program')], 'center'),
                    ],
                    [
                        $this->img(self::IMG_QURAN, 'Muroja\'ah bersama', 'center'),
                        $this->p([$this->bold('6'), $this->t(' jam belajar intensif')], 'center'),
                    ],
                ]),
                $this->h3('Dokumentasi Video'),
                $this->yt('ayXxwJJId_c'),
                $this->video(self::VIDEO_SAMPLE, self::IMG_EXCURSION),
                $this->blockquote('“Pengalaman ini membuat anak saya lebih semangat mengejar target hafalan.” — Orang tua pendamping'),
            ]),
        ];
    }
}
