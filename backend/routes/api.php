<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\GoogleAuthController;
use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\CourseEnrollmentController;
use App\Http\Controllers\Admin\CourseLessonController;
use App\Http\Controllers\Admin\CourseModuleController;
use App\Http\Controllers\Admin\CourseProgressController;
use App\Http\Controllers\Admin\CurriculumController as AdminCurriculumController;
use App\Http\Controllers\Admin\FacilityController as AdminFacilityController;
use App\Http\Controllers\Admin\VirtualTourController as AdminVirtualTourController;
use App\Http\Controllers\Admin\FacilityPhotoController;
use App\Http\Controllers\Admin\HeroSliderController as AdminHeroSliderController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\PmbDocumentController;
use App\Http\Controllers\Admin\PmbRegistrationController as AdminPmbRegistrationController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SchoolController as AdminSchoolController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\StudentActivityController as AdminStudentActivityController;
use App\Http\Controllers\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\CurriculumController;
use App\Http\Controllers\Api\V1\FacilityController;
use App\Http\Controllers\Api\V1\HeroSliderController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\PmbRegistrationController;
use App\Http\Controllers\Api\V1\SchoolController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\StudentActivityController;
use App\Http\Controllers\Api\V1\TeacherController;
use App\Http\Controllers\Api\V1\TestimonialController;
use App\Http\Controllers\Api\V1\VirtualTourController;
use App\Http\Middleware\EnsurePanelUser;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('schools', [SchoolController::class, 'index']);
    Route::get('schools/{slug}', [SchoolController::class, 'show']);

    Route::get('hero-sliders', [HeroSliderController::class, 'index']);
    Route::get('curriculums', [CurriculumController::class, 'index']);
    Route::get('curriculums/{slug}', [CurriculumController::class, 'showBySlug']);
    Route::get('teachers', [TeacherController::class, 'index']);
    Route::get('teachers/uuid/{uuid}', [TeacherController::class, 'showByUuid'])
        ->whereUuid('uuid')
        ->name('v1.teachers.showByUuid');
    Route::get('teachers/{slug}', [TeacherController::class, 'showBySlug'])
        ->where('slug', '[a-z0-9\-]+')
        ->name('v1.teachers.showBySlug');
    Route::get('student-activities', [StudentActivityController::class, 'index']);
    Route::get('student-activities/uuid/{uuid}', [StudentActivityController::class, 'showByUuid'])
        ->name('v1.student-activities.showByUuid');
    Route::get('student-activities/{slug}', [StudentActivityController::class, 'showBySlug'])
        ->name('v1.student-activities.showBySlug');
    Route::get('facilities', [FacilityController::class, 'index']);
    Route::get('facilities/{slug}', [FacilityController::class, 'showBySlug'])
        ->name('v1.facilities.showBySlug');
    Route::get('news', [NewsController::class, 'index']);
    Route::get('news/uuid/{uuid}', [NewsController::class, 'showByUuid'])
        ->name('v1.news.showByUuid');
    Route::get('news/{slug}', [NewsController::class, 'showBySlug'])
        ->name('v1.news.showBySlug');
    Route::get('testimonials', [TestimonialController::class, 'index']);
    Route::get('virtual-tours', [VirtualTourController::class, 'index']);
    Route::get('virtual-tours/{slug}', [VirtualTourController::class, 'showBySlug'])
        ->where('slug', '[a-z0-9\-]+')
        ->name('v1.virtual-tours.showBySlug');
    Route::get('courses', [CourseController::class, 'index']);
    Route::get('courses/{slug}', [CourseController::class, 'showBySlug']);
    Route::get('settings', [SettingController::class, 'index']);

    Route::post('pmb/registrations', [PmbRegistrationController::class, 'store'])
        ->middleware('throttle:10,1');
    Route::get('pmb/track/{token}', [PmbRegistrationController::class, 'track']);
});

Route::prefix('admin')->group(function (): void {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::prefix('auth/google')->middleware('throttle:10,1')->group(function (): void {
        Route::get('redirect', [GoogleAuthController::class, 'redirect']);
        Route::get('callback', [GoogleAuthController::class, 'callback']);
        Route::post('exchange', [GoogleAuthController::class, 'exchange']);
    });

    Route::middleware(['auth:sanctum', EnsurePanelUser::class])->group(function (): void {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::get('profile', [ProfileController::class, 'show']);
        Route::patch('profile', [ProfileController::class, 'update']);

        Route::middleware(EnsureUserIsAdmin::class)->group(function (): void {
            Route::apiResource('users', UserController::class);
            Route::apiResource('schools', AdminSchoolController::class);
        Route::apiResource('hero-sliders', AdminHeroSliderController::class);
        Route::apiResource('curriculums', AdminCurriculumController::class);
        Route::apiResource('teachers', AdminTeacherController::class);
        Route::post('uploads', [UploadController::class, 'store']);

        Route::patch('news/{news}/publish', [AdminNewsController::class, 'publish']);
        Route::patch('news/{news}/unpublish', [AdminNewsController::class, 'unpublish']);
        Route::apiResource('news', AdminNewsController::class);

        Route::patch('student-activities/{student_activity}/publish', [AdminStudentActivityController::class, 'publish']);
        Route::patch('student-activities/{student_activity}/unpublish', [AdminStudentActivityController::class, 'unpublish']);
        Route::apiResource('student-activities', AdminStudentActivityController::class);
        Route::apiResource('facilities', AdminFacilityController::class);
        Route::apiResource('virtual-tours', AdminVirtualTourController::class);
        Route::apiResource('facility-photos', FacilityPhotoController::class);
        Route::apiResource('testimonials', AdminTestimonialController::class);
        Route::apiResource('courses', AdminCourseController::class);
        Route::apiResource('course-modules', CourseModuleController::class);
        Route::apiResource('course-lessons', CourseLessonController::class);
        Route::apiResource('course-enrollments', CourseEnrollmentController::class);
        Route::apiResource('course-progress', CourseProgressController::class);
        Route::apiResource('pmb-registrations', AdminPmbRegistrationController::class);
        Route::apiResource('pmb-documents', PmbDocumentController::class);
        Route::apiResource('media', MediaController::class);
        Route::apiResource('settings', AdminSettingController::class);
        });
    });
});
