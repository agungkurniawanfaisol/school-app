<?php

namespace App\Providers;

use App\Repositories\CourseEnrollmentRepository;
use App\Repositories\CourseLessonRepository;
use App\Repositories\CourseModuleRepository;
use App\Repositories\CourseProgressRepository;
use App\Repositories\CourseRepository;
use App\Repositories\CurriculumRepository;
use App\Repositories\FacilityPhotoRepository;
use App\Repositories\FacilityRepository;
use App\Repositories\HeroSliderRepository;
use App\Repositories\MediaRepository;
use App\Repositories\NewsRepository;
use App\Repositories\PmbDocumentRepository;
use App\Repositories\PmbRegistrationRepository;
use App\Repositories\SchoolRepository;
use App\Repositories\SettingRepository;
use App\Repositories\StudentActivityRepository;
use App\Repositories\TeacherRepository;
use App\Repositories\TestimonialRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $bindings = [
            SchoolRepository::class,
            HeroSliderRepository::class,
            CurriculumRepository::class,
            TeacherRepository::class,
            StudentActivityRepository::class,
            FacilityRepository::class,
            FacilityPhotoRepository::class,
            NewsRepository::class,
            TestimonialRepository::class,
            CourseRepository::class,
            CourseModuleRepository::class,
            CourseLessonRepository::class,
            CourseEnrollmentRepository::class,
            CourseProgressRepository::class,
            PmbRegistrationRepository::class,
            PmbDocumentRepository::class,
            MediaRepository::class,
            SettingRepository::class,
        ];

        foreach ($bindings as $repository) {
            $this->app->singleton($repository);
        }
    }

    public function boot(): void
    {
        //
    }
}
