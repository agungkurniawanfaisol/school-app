<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@nurulhikmah.sch.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );

        School::query()->updateOrCreate(
            ['slug' => 'nurul-hikmah'],
            [
                'name' => 'Sekolah Islam Nurul Hikmah',
                'is_active' => true,
            ],
        );

        $this->call(AcademicYearSeeder::class);
        $this->call(SchoolAboutSeeder::class);
        $this->call(SchoolValueSeeder::class);
        $this->call(SchoolStatSeeder::class);
        $this->call(DemoContentSeeder::class);
        $this->call(PmbFeeSeeder::class);
        $this->call(VirtualTourSeeder::class);
        $this->call(AppReleaseSeeder::class);

        $teacher = Teacher::query()->orderBy('id')->first();

        User::query()->updateOrCreate(
            ['email' => 'guru@nurulhikmah.sch.id'],
            [
                'name' => 'Ustadz Ahmad Fauzi',
                'password' => Hash::make('password'),
                'role' => 'guru',
                'is_active' => true,
                'teacher_id' => $teacher?->id,
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'pendaftar@nurulhikmah.sch.id'],
            [
                'name' => 'Calon Siswa Demo',
                'password' => Hash::make('password'),
                'role' => User::ROLE_PENDAFTAR,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );

        Artisan::call('cache:clear');
    }
}
