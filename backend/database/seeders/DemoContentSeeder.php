<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\Curriculum;
use App\Models\Facility;
use App\Models\FacilityPhoto;
use App\Models\HeroSlider;
use App\Models\News;
use App\Models\PmbDocument;
use App\Models\PmbRegistration;
use App\Models\School;
use App\Models\Setting;
use App\Models\StudentActivity;
use App\Models\Testimonial;
use App\Models\User;
use Database\Seeders\Concerns\SeedsActivityRichContent;
use Database\Seeders\Concerns\SeedsNewsRichContent;
use Illuminate\Database\Seeder;

class DemoContentSeeder extends Seeder
{
    use SeedsActivityRichContent;
    use SeedsNewsRichContent;
    public function run(): void
    {
        $school = School::query()->where('slug', 'nurul-hikmah')->firstOrFail();
        $admin = User::query()->where('email', 'admin@nurulhikmah.sch.id')->firstOrFail();

        $this->seedHeroSliders($school);
        $this->seedCurriculums($school);
        $this->call(TeacherDemoSeeder::class);
        $this->seedActivities($school);
        $this->seedFacilities($school);
        $this->seedNews($school, $admin);
        $this->seedTestimonials($school);
        $this->seedCourses($school);
        $this->seedPmb($school);
        $this->seedSettings($school);
    }

    private function seedHeroSliders(School $school): void
    {
        $slides = [
            [
                'title' => 'Selamat Datang di Nurul Hikmah',
                'subtitle' => 'Membentuk Generasi Qurani & Berakhlak Mulia',
                'image' => 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80',
                'cta_text' => 'Daftar PMB',
                'cta_url' => '/pmb/daftar',
                'order' => 1,
            ],
            [
                'title' => 'Program Tahfidz Terstruktur',
                'subtitle' => 'Bimbingan hafalan Al-Qur\'an dengan metode terbukti',
                'image' => 'https://images.unsplash.com/photo-1609599006353-e6aa9f3f5b4a?w=1600&q=80',
                'cta_text' => 'Pelajari Kurikulum',
                'cta_url' => '/#kurikulum',
                'order' => 2,
            ],
            [
                'title' => 'Kursus Online untuk Siswa',
                'subtitle' => 'Belajar kapan saja melalui platform e-learning sekolah',
                'image' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80',
                'cta_text' => 'Lihat Kursus',
                'cta_url' => '/kursus',
                'order' => 3,
            ],
        ];

        foreach ($slides as $slide) {
            HeroSlider::query()->updateOrCreate(
                ['school_id' => $school->id, 'title' => $slide['title']],
                [
                    ...$slide,
                    'is_active' => true,
                ],
            );
        }
    }

    private function seedCurriculums(School $school): void
    {
        $items = [
            [
                'slug' => 'kurikulum-tahfidz',
                'title' => 'Program Tahfidz',
                'excerpt' => 'Hafalan Al-Qur\'an bertahap dengan evaluasi rutin.',
                'content' => "Program tahfidz dirancang untuk membimbing siswa menghafal Al-Qur\'an dengan tajwid yang benar.\n\nSetiap siswa mendapat target hafalan mingguan dan murajaah harian bersama musyrif.",
                'icon' => 'book-quran',
                'category' => 'tahfidz',
                'order' => 1,
                'is_featured' => true,
            ],
            [
                'slug' => 'kurikulum-akademik',
                'title' => 'Akademik Unggulan',
                'excerpt' => 'Kurikulum nasional diperkaya literasi dan numerasi.',
                'content' => 'Pembelajaran aktif, proyek P5, dan pendalaman materi inti untuk persiapan jenjang berikutnya.',
                'icon' => 'graduation-cap',
                'category' => 'akademik',
                'order' => 2,
                'is_featured' => true,
            ],
            [
                'slug' => 'kurikulum-karakter',
                'title' => 'Pembinaan Karakter',
                'excerpt' => 'Nilai akhlak dan kepemimpinan siswa.',
                'content' => 'Kegiatan rutin pembiasaan shalat berjamaah, adab, dan tanggung jawab sosial melalui program AMAL sekolah.',
                'icon' => 'heart',
                'category' => 'karakter',
                'order' => 3,
                'is_featured' => true,
            ],
            [
                'slug' => 'kurikulum-bahasa-arab',
                'title' => 'Bahasa Arab & Inggris',
                'excerpt' => 'Komunikasi aktif dua bahasa asing.',
                'content' => 'Kelas percakapan, klub bahasa, dan olimpiade internal untuk memperkuat kemampuan berbahasa.',
                'icon' => 'languages',
                'category' => 'bahasa',
                'order' => 4,
                'is_featured' => true,
            ],
            [
                'slug' => 'kurikulum-steam-robotik',
                'title' => 'STEAM & Robotik',
                'excerpt' => 'Sains, teknologi, dan coding untuk siswa kreatif.',
                'content' => 'Laboratorium robotik, proyek Arduino, dan kompetisi sains tingkat sekolah hingga kota.',
                'icon' => 'cpu',
                'category' => 'teknologi',
                'order' => 5,
                'is_featured' => true,
            ],
            [
                'slug' => 'kurikulum-amal-sosial',
                'title' => 'Program AMAL Sosial',
                'excerpt' => 'Akhlak, Ilmu, Amal — peduli sesama.',
                'content' => 'Bakti sosial, zakat siswa, dan program adopsi lingkungan sekitar sekolah.',
                'icon' => 'hand-heart',
                'category' => 'sosial',
                'order' => 6,
                'is_featured' => true,
            ],
            [
                'slug' => 'kurikulum-ekstrakurikuler',
                'title' => 'Ekstrakurikuler Unggulan',
                'excerpt' => 'Pramuka, seni, olahraga, dan paduan suara.',
                'content' => 'Lebih dari 15 ekstrakurikuler dengan pembina berpengalaman dan jadwal terstruktur.',
                'icon' => 'sparkles',
                'category' => 'ekskur',
                'order' => 7,
                'is_featured' => false,
            ],
            [
                'slug' => 'kurikulum-literasi-digital',
                'title' => 'Literasi Digital',
                'excerpt' => 'Cerdas ber-IT dengan etika digital.',
                'content' => 'Pembelajaran coding dasar, keamanan siber, dan produksi konten positif.',
                'icon' => 'monitor',
                'category' => 'teknologi',
                'order' => 8,
                'is_featured' => false,
            ],
            [
                'slug' => 'kurikulum-kepemimpinan',
                'title' => 'Kepemimpinan Siswa',
                'excerpt' => 'OSIS, MPK, dan duta sekolah.',
                'content' => 'Pelatihan public speaking, manajemen acara, dan representasi sekolah di forum eksternal.',
                'icon' => 'users',
                'category' => 'kepemimpinan',
                'order' => 9,
                'is_featured' => false,
            ],
            [
                'slug' => 'kurikulum-parenting',
                'title' => 'Parenting School Partnership',
                'excerpt' => 'Kolaborasi aktif sekolah dan orang tua.',
                'content' => 'Workshop parenting, konsultasi BK, dan laporan perkembangan anak berkala.',
                'icon' => 'home',
                'category' => 'orang-tua',
                'order' => 10,
                'is_featured' => false,
            ],
        ];

        foreach ($items as $item) {
            Curriculum::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'school_id' => $school->id,
                    ...$item,
                    'is_active' => true,
                ],
            );
        }
    }

    private function seedActivities(School $school): void
    {
        $richProfiles = $this->activityRichProfiles();

        $activities = [
            [
                'slug' => 'lomba-tahfidz-2026',
                'title' => 'Lomba Tahfidz Sekolah 2026',
                'excerpt' => 'Gemuruh tilawah memenuhi aula — 126 peserta bersaing dalam 4 kategori hafalan.',
                'category' => 'akademik',
                'days_ago' => 7,
                'featured' => true,
            ],
            [
                'slug' => 'bakti-sosial-ramadhan',
                'title' => 'Bakti Sosial Ramadhan',
                'excerpt' => '250 paket sembako & berbuka disalurkan siswa ke warga sekitar dalam semangat berbagi.',
                'category' => 'sosial',
                'days_ago' => 21,
                'featured' => true,
            ],
            [
                'slug' => 'study-tour-museum',
                'title' => 'Study Tour Museum Nasional',
                'excerpt' => 'Kelas 5 menjelajah sejarah Nusantara lewat artefak, workshop, dan petualangan interaktif.',
                'category' => 'ekskur',
                'days_ago' => 35,
                'featured' => false,
            ],
            [
                'slug' => 'festival-seni-islam',
                'title' => 'Festival Seni Islam',
                'excerpt' => 'Panggung gemilang nasyid, kaligrafi, dan pidato Arab di hadapan 400+ orang tua.',
                'category' => 'seni',
                'days_ago' => 14,
                'featured' => true,
            ],
            [
                'slug' => 'olimpiade-matematika',
                'title' => 'Olimpiade Matematika Internal',
                'excerpt' => '500 siswa berkompetisi — 6 delegasi terpilih menuju olimpiade tingkat kota.',
                'category' => 'akademik',
                'days_ago' => 45,
                'featured' => false,
            ],
            [
                'slug' => 'pramuka-persiapan-giat',
                'title' => 'Persiapan Giat Pramuka',
                'excerpt' => '72 pramuka penggalang latihan intensif: tenda, tali temali, dan survival di alam terbuka.',
                'category' => 'pramuka',
                'days_ago' => 3,
                'featured' => false,
            ],
            [
                'slug' => 'giat-pramuka-perkemahan',
                'title' => 'Giat Pramuka Perkemahan Akhir Tahun',
                'excerpt' => 'Perkemahan tiga hari dua malam penuh tantangan leadership dan kepedulian lingkungan.',
                'category' => 'pramuka',
                'days_ago' => 10,
                'featured' => true,
            ],
            [
                'slug' => 'kompetisi-kaligrafi',
                'title' => 'Kompetisi Kaligrafi Islam',
                'excerpt' => 'Karya kaligrafi siswa dipamerkan dalam festival seni Islam minggu ini.',
                'category' => 'seni',
                'days_ago' => 28,
                'featured' => false,
            ],
            [
                'slug' => 'senam-sehat-bersama',
                'title' => 'Senam Sehat & Gizi Bersama',
                'excerpt' => 'Seluruh warga sekolah senam pagi bersama ahli gizi untuk gaya hidup sehat.',
                'category' => 'kesehatan',
                'days_ago' => 2,
                'featured' => false,
            ],
            [
                'slug' => 'bakti-lingkungan-harian',
                'title' => 'Gerakan Peduli Lingkungan Sekolah',
                'excerpt' => 'Program Jumat bersih: daur ulang, taman hijau, dan edukasi eco-school.',
                'category' => 'sosial',
                'days_ago' => 1,
                'featured' => false,
            ],
        ];

        foreach ($activities as $i => $activity) {
            $published = now()->subDays($activity['days_ago']);
            $rich = $richProfiles[$activity['slug']] ?? null;

            StudentActivity::query()->updateOrCreate(
                ['slug' => $activity['slug']],
                [
                    'school_id' => $school->id,
                    'title' => $activity['title'],
                    'excerpt' => $activity['excerpt'],
                    'content' => $rich['content'] ?? null,
                    'content_json' => $rich['content_json'] ?? null,
                    'thumbnail' => $rich['thumbnail'] ?? null,
                    'category' => $activity['category'],
                    'status' => 'published',
                    'activity_date' => $published->toDateString(),
                    'order' => $i + 1,
                    'is_active' => true,
                    'is_featured' => $activity['featured'],
                    'published_at' => $published,
                ],
            );
        }
    }

    private function seedFacilities(School $school): void
    {
        $facilities = [
            ['slug' => 'masjid-sekolah', 'name' => 'Masjid Nurul Hikmah', 'description' => 'Masjid sekolah untuk shalat berjamaah dan kegiatan keagamaan.', 'category' => 'ibadah', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1609599006353-e6aa9f3f5b4a?w=1200&q=80'],
            ['slug' => 'perpustakaan', 'name' => 'Perpustakaan Digital', 'description' => 'Koleksi buku, e-book, dan ruang baca nyaman.', 'category' => 'akademik', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80'],
            ['slug' => 'laboratorium-komputer', 'name' => 'Lab Komputer', 'description' => 'Fasilitas ICT untuk pembelajaran coding dan literasi digital.', 'category' => 'teknologi', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80'],
            ['slug' => 'lapangan-olahraga', 'name' => 'Lapangan Olahraga', 'description' => 'Area futsal dan basket untuk kegiatan PJOK dan ekstrakurikuler.', 'category' => 'olahraga', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=1200&q=80'],
            ['slug' => 'kantin-sehat', 'name' => 'Kantin Sehat', 'description' => 'Menu bergizi dengan pengawasan gizi sekolah.', 'category' => 'penunjang', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80'],
            ['slug' => 'ruang-tahfidz', 'name' => 'Ruang Tahfidz', 'description' => 'Ruang khusus setoran hafalan dengan akustik nyaman.', 'category' => 'ibadah', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1609599006353-e6aa9f3f5b4a?w=1200&q=80'],
            ['slug' => 'laboratorium-ipa', 'name' => 'Laboratorium IPA', 'description' => 'Praktikum sains dengan peralatan eksperimen lengkap.', 'category' => 'akademik', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80'],
            ['slug' => 'ruang-seni-musik', 'name' => 'Ruang Seni & Musik', 'description' => 'Studio untuk paduan suara, nasyid, dan seni kaligrafi.', 'category' => 'seni', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80'],
            ['slug' => 'ruang-multimedia', 'name' => 'Ruang Multimedia', 'description' => 'Produksi konten edukatif dan siaran internal sekolah.', 'category' => 'teknologi', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80'],
            ['slug' => 'klinik-sekolah', 'name' => 'Klinik Sekolah', 'description' => 'Layanan kesehatan dasar dan UKS dengan perawat bersertifikat.', 'category' => 'kesehatan', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80'],
            ['slug' => 'ruang-bk', 'name' => 'Ruang Bimbingan Konseling', 'description' => 'Konsultasi siswa dan orang tua dengan guru BK profesional.', 'category' => 'penunjang', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1577896851231-70ef94081756?w=1200&q=80'],
            ['slug' => 'asrama-putra', 'name' => 'Asrama Putra', 'description' => 'Pondok pesantren modern dengan pembinaan 24 jam.', 'category' => 'asrama', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80'],
            ['slug' => 'asrama-putri', 'name' => 'Asrama Putri', 'description' => 'Asrama nyaman dengan pengawasan ustadzah dan keamanan tertutup.', 'category' => 'asrama', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'],
            ['slug' => 'ruang-pramuka', 'name' => 'Ruang Pramuka', 'description' => 'Peralatan camping, seragam, dan materi kepramukaan.', 'category' => 'ekskur', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80'],
            ['slug' => 'auditorium', 'name' => 'Auditorium Serbaguna', 'description' => 'Kapasitas 500 orang untuk acara sekolah dan pertemuan orang tua.', 'category' => 'penunjang', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'],
            ['slug' => 'ruang-guru', 'name' => 'Ruang Guru & Musyawarah', 'description' => 'Ruang kerja kolaboratif tenaga pendidik dan staf.', 'category' => 'penunjang', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'],
            ['slug' => 'taman-baca', 'name' => 'Taman Baca Outdoor', 'description' => 'Area baca terbuka dengan pohon rindang dan wifi sekolah.', 'category' => 'akademik', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80'],
            ['slug' => 'lapangan-futsal', 'name' => 'Lapangan Futsal', 'description' => 'Lapangan sintetis standar untuk latihan dan turnamen internal.', 'category' => 'olahraga', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80'],
            ['slug' => 'ruang-robotik', 'name' => 'Lab Robotik & STEAM', 'description' => 'Proyek Arduino, LEGO robotics, dan kompetisi sains.', 'category' => 'teknologi', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80'],
            ['slug' => 'musholla-putri', 'name' => 'Musholla Putri', 'description' => 'Tempat ibadah dan kajian khusus siswi.', 'category' => 'ibadah', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1609599006353-e6aa9f3f5b4a?w=1200&q=80'],
        ];

        foreach ($facilities as $i => $data) {
            $facility = Facility::query()->updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'school_id' => $school->id,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'category' => $data['category'],
                    'thumbnail' => $data['image'],
                    'order' => $i + 1,
                    'is_active' => true,
                    'is_featured' => $data['featured'],
                ],
            );

            FacilityPhoto::query()->updateOrCreate(
                ['facility_id' => $facility->id, 'path' => $data['image']],
                [
                    'caption' => "Foto {$data['name']}",
                    'order' => 1,
                    'is_active' => true,
                ],
            );
        }
    }

    private function seedNews(School $school, User $admin): void
    {
        $richProfiles = $this->newsRichProfiles();

        $articles = [
            [
                'slug' => 'pembukaan-pmb-2026',
                'title' => 'Pembukaan PMB Tahun Ajaran 2026/2027',
                'excerpt' => 'Pendaftaran peserta didik baru resmi dibuka — lengkap dengan alur online, video profil, dan jadwal seleksi.',
                'category' => 'pengumuman',
                'featured' => true,
                'days_ago' => 0,
            ],
            [
                'slug' => 'prestasi-olimpiade-tahfidz',
                'title' => 'Siswa Raih Juara 1 Olimpiade Tahfidz Tingkat Kota',
                'excerpt' => 'Tim tahfidz Nurul Hikmah membawa pulang medali emas, perak, dan penghargaan sekolah berprestasi.',
                'category' => 'prestasi',
                'featured' => true,
                'days_ago' => 5,
            ],
            [
                'slug' => 'workshop-orang-tua',
                'title' => 'Workshop Parenting: Mendampingi Anak di Era Digital',
                'excerpt' => 'Kegiatan interaktif orang tua siswa bersama psikolog pendidikan dan materi video pendamping.',
                'category' => 'kegiatan',
                'featured' => false,
                'days_ago' => 12,
            ],
            [
                'slug' => 'jadwal-ujian-akhir',
                'title' => 'Jadwal Ujian Akhir Semester Genap',
                'excerpt' => 'Informasi lengkap jadwal ujian per jenjang, ketentuan peserta, dan jadwal remedial.',
                'category' => 'pengumuman',
                'featured' => false,
                'days_ago' => 18,
            ],
            [
                'slug' => 'kunjungan-pesantren',
                'title' => 'Kunjungan Edukatif ke Pesantren Mitra',
                'excerpt' => 'Siswa kelas 8 mengikuti program inspirasi tahfidz intensif dengan dokumentasi foto & video.',
                'category' => 'kegiatan',
                'featured' => false,
                'days_ago' => 25,
            ],
            [
                'slug' => 'libur-semester-akhir',
                'title' => 'Libur Semester & Program Pengayaan',
                'excerpt' => 'Jadwal libur resmi dan program tahfidz serta literasi opsional selama liburan.',
                'category' => 'pengumuman',
                'featured' => false,
                'days_ago' => 8,
            ],
            [
                'slug' => 'pelatihan-guru-kurikulum',
                'title' => 'Pelatihan Guru Kurikulum Merdeka',
                'excerpt' => 'Workshop internal untuk desain proyek P5 dan penilaian autentik.',
                'category' => 'kegiatan',
                'featured' => false,
                'days_ago' => 15,
            ],
            [
                'slug' => 'penghargaan-adiwiyata',
                'title' => 'Penghargaan Adiwiyata Tingkat Kota',
                'excerpt' => 'Nurul Hikmah meraih penghargaan sekolah peduli lingkungan.',
                'category' => 'prestasi',
                'featured' => true,
                'days_ago' => 20,
            ],
            [
                'slug' => 'program-khatam-quran',
                'title' => 'Program Khatam Al-Qur\'an Angkatan 2026',
                'excerpt' => '34 siswa khatam 30 juz dalam acara khidmat penuh haru.',
                'category' => 'prestasi',
                'featured' => true,
                'days_ago' => 30,
            ],
            [
                'slug' => 'hari-pahlawan-sekolah',
                'title' => 'Peringatan Hari Pahlawan di Sekolah',
                'excerpt' => 'Lomba pidato, pameran sejarah, dan kirab budaya Nusantara.',
                'category' => 'kegiatan',
                'featured' => false,
                'days_ago' => 60,
            ],
        ];

        foreach ($articles as $i => $article) {
            $published = now()->subDays($article['days_ago']);
            $rich = $richProfiles[$article['slug']] ?? null;

            News::query()->updateOrCreate(
                ['slug' => $article['slug']],
                [
                    'school_id' => $school->id,
                    'user_id' => $admin->id,
                    'title' => $article['title'],
                    'excerpt' => $article['excerpt'],
                    'content' => $rich['content'] ?? null,
                    'content_json' => $rich['content_json'] ?? null,
                    'thumbnail' => $rich['thumbnail'] ?? null,
                    'category' => $article['category'],
                    'status' => 'published',
                    'order' => $i + 1,
                    'is_active' => true,
                    'is_featured' => $article['featured'],
                    'published_at' => $published,
                ],
            );
        }
    }

    private function seedTestimonials(School $school): void
    {
        $items = [
            ['name' => 'Ibu Siti Aminah', 'role' => 'Orang Tua Siswa SD', 'content' => 'Anak saya semakin rajin belajar dan menghafal Al-Qur\'an sejak bersekolah di Nurul Hikmah.', 'rating' => 5],
            ['name' => 'Bapak Hendra Wijaya', 'role' => 'Orang Tua Siswa SMP', 'content' => 'Guru-guru sangat perhatian. Lingkungan sekolah aman dan mendukung perkembangan karakter.', 'rating' => 5],
            ['name' => 'Ibu Ratna Dewi', 'role' => 'Alumni 2018', 'content' => 'Pendidikan di sini membentuk fondasi akhlak yang saya rasakan hingga kuliah.', 'rating' => 5],
            ['name' => 'Bapak Agus Prasetyo', 'role' => 'Orang Tua Siswa', 'content' => 'Program tahfidz terstruktur dan laporan perkembangan anak jelas setiap bulan.', 'rating' => 4],
            ['name' => 'Ibu Fitri Handayani', 'role' => 'Komite Sekolah', 'content' => 'Kolaborasi sekolah dan orang tua sangat baik, terutama dalam kegiatan sosial.', 'rating' => 5],
        ];

        foreach ($items as $i => $item) {
            Testimonial::query()->updateOrCreate(
                ['school_id' => $school->id, 'name' => $item['name']],
                [
                    'role' => $item['role'],
                    'content' => $item['content'],
                    'rating' => $item['rating'],
                    'photo' => null,
                    'order' => $i + 1,
                    'is_active' => true,
                    'is_featured' => $i < 3,
                ],
            );
        }
    }

    private function seedCourses(School $school): void
    {
        $course = Course::query()->updateOrCreate(
            ['slug' => 'pengenalan-tajwid-dasar'],
            [
                'school_id' => $school->id,
                'title' => 'Pengenalan Tajwid Dasar',
                'excerpt' => 'Kursus gratis untuk memperkuat bacaan Al-Qur\'an siswa pemula.',
                'description' => 'Materi mencakup makharijul huruf, hukum nun mati dan tanwin, serta mad dasar.',
                'thumbnail' => null,
                'category' => 'tahfidz',
                'level' => 'pemula',
                'duration_minutes' => 120,
                'price' => 0,
                'status' => 'published',
                'order' => 1,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now()->subDays(10),
            ],
        );

        $module = CourseModule::query()->updateOrCreate(
            ['course_id' => $course->id, 'slug' => 'modul-huruf-hijaiyah'],
            [
                'title' => 'Huruf Hijaiyah & Makharij',
                'description' => 'Pengenalan huruf dan tempat keluarnya huruf.',
                'order' => 1,
                'is_active' => true,
            ],
        );

        $lessons = [
            ['slug' => 'pengenalan-huruf', 'title' => 'Pengenalan Huruf Hijaiyah', 'minutes' => 15, 'free' => true],
            ['slug' => 'makharij-huruf', 'title' => 'Makharijul Huruf', 'minutes' => 20, 'free' => false],
            ['slug' => 'latihan-bacaan', 'title' => 'Latihan Bacaan Pendek', 'minutes' => 25, 'free' => false],
        ];

        foreach ($lessons as $i => $lesson) {
            CourseLesson::query()->updateOrCreate(
                ['course_module_id' => $module->id, 'slug' => $lesson['slug']],
                [
                    'title' => $lesson['title'],
                    'type' => 'text',
                    'content' => "Materi pelajaran: {$lesson['title']}.",
                    'duration_minutes' => $lesson['minutes'],
                    'order' => $i + 1,
                    'is_active' => true,
                    'is_free_preview' => $lesson['free'],
                ],
            );
        }

        Course::query()->updateOrCreate(
            ['slug' => 'matematika-sd-kelas-5'],
            [
                'school_id' => $school->id,
                'title' => 'Matematika SD Kelas 5',
                'excerpt' => 'Pendalaman pecahan, geometri, dan soal cerita.',
                'description' => 'Kursus pendamping untuk siswa kelas 5 dengan latihan interaktif.',
                'thumbnail' => null,
                'category' => 'akademik',
                'level' => 'menengah',
                'duration_minutes' => 180,
                'price' => 150000,
                'status' => 'published',
                'order' => 2,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now()->subDays(5),
            ],
        );

        Course::query()->updateOrCreate(
            ['slug' => 'bahasa-arab-pemula'],
            [
                'school_id' => $school->id,
                'title' => 'Bahasa Arab untuk Pemula',
                'excerpt' => 'Percakapan harian dan kosakata dasar.',
                'description' => 'Mengenal huruf, kata benda, dan frasa sederhana dalam bahasa Arab.',
                'thumbnail' => null,
                'category' => 'bahasa',
                'level' => 'pemula',
                'duration_minutes' => 90,
                'price' => 99000,
                'status' => 'published',
                'order' => 3,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now()->subDays(2),
            ],
        );
    }

    private function seedPmb(School $school): void
    {
        $demo = PmbRegistration::query()->updateOrCreate(
            ['registration_number' => 'PMB-20260703-DEMO01'],
            [
                'school_id' => $school->id,
                'tracking_token' => 'demo-token-nurul-hikmah-2026',
                'student_name' => 'Ahmad Fadilah',
                'birth_place' => 'Jakarta',
                'birth_date' => '2015-03-12',
                'gender' => 'L',
                'parent_name' => 'Bapak Rudi Hartono',
                'parent_phone' => '081234567890',
                'parent_email' => 'rudi.hartono@example.com',
                'address' => 'Jl. Melati No. 8, Jakarta Selatan',
                'previous_school' => 'TK Islam Al-Azhar',
                'grade_applied' => 'SD',
                'status' => 'accepted',
                'notes' => 'Data contoh untuk demonstrasi pelacakan PMB.',
            ],
        );

        PmbDocument::query()->updateOrCreate(
            ['pmb_registration_id' => $demo->id, 'document_type' => 'akta_kelahiran'],
            [
                'file_path' => '/uploads/pmb/demo/akta.pdf',
                'original_name' => 'akta_kelahiran.pdf',
                'status' => 'approved',
            ],
        );

        PmbRegistration::query()->updateOrCreate(
            ['registration_number' => 'PMB-20260703-DEMO02'],
            [
                'school_id' => $school->id,
                'tracking_token' => 'demo-token-nurul-hikmah-pending',
                'student_name' => 'Siti Khadijah',
                'birth_place' => 'Depok',
                'birth_date' => '2014-08-20',
                'gender' => 'P',
                'parent_name' => 'Ibu Maya Sari',
                'parent_phone' => '081298765432',
                'parent_email' => 'maya.sari@example.com',
                'address' => 'Jl. Kenanga No. 15, Depok',
                'previous_school' => 'SDIT Bina Umat',
                'grade_applied' => 'SMP',
                'status' => 'pending',
            ],
        );
    }

    private function seedSettings(School $school): void
    {
        $settings = [
            ['group' => 'general', 'key' => 'site_name', 'value' => 'Sekolah Islam Nurul Hikmah', 'type' => 'string'],
            ['group' => 'general', 'key' => 'site_tagline', 'value' => 'Membentuk Generasi Qurani & Berakhlak Mulia', 'type' => 'string'],
            ['group' => 'pmb', 'key' => 'is_open', 'value' => 'true', 'type' => 'boolean'],
            ['group' => 'pmb', 'key' => 'pmb_description', 'value' => 'Pendaftaran Peserta Didik Baru Tahun Ajaran 2026/2027 telah dibuka. Kuota terbatas untuk setiap jenjang.', 'type' => 'string'],
            ['group' => 'pmb', 'key' => 'pmb_period', 'value' => '1 Januari – 30 Juni 2026', 'type' => 'string'],
            ['group' => 'pmb', 'key' => 'pmb_quota', 'value' => 'TK: 30 | SD: 60 | SMP: 40 siswa', 'type' => 'string'],
            [
                'group' => 'pmb',
                'key' => 'pmb_requirements',
                'value' => "1. Fotokopi akta kelahiran\n2. Fotokopi kartu keluarga\n3. Pas foto 3×4 (2 lembar)\n4. Rapor semester terakhir\n5. Surat keterangan lulus (jika pindahan)",
                'type' => 'string',
            ],
            ['group' => 'pmb', 'key' => 'pmb_fee', 'value' => 'Rp 350.000', 'type' => 'string'],
            ['group' => 'contact', 'key' => 'office_hours', 'value' => 'Senin–Jumat, 07.00–15.00 WIB', 'type' => 'string'],
        ];

        foreach ($settings as $setting) {
            Setting::query()->updateOrCreate(
                [
                    'school_id' => $school->id,
                    'group' => $setting['group'],
                    'key' => $setting['key'],
                ],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                ],
            );
        }
    }
}
