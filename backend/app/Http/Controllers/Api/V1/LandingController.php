<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CurriculumResource;
use App\Http\Resources\V1\FacilityResource;
use App\Http\Resources\V1\HeroSliderResource;
use App\Http\Resources\V1\NewsResource;
use App\Http\Resources\V1\SchoolResource;
use App\Http\Resources\V1\StudentActivityResource;
use App\Http\Resources\V1\TeacherResource;
use App\Http\Resources\V1\TestimonialResource;
use App\Repositories\CurriculumRepository;
use App\Repositories\FacilityRepository;
use App\Repositories\HeroSliderRepository;
use App\Repositories\NewsRepository;
use App\Repositories\SchoolRepository;
use App\Repositories\StudentActivityRepository;
use App\Repositories\TeacherRepository;
use App\Repositories\TestimonialRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class LandingController extends Controller
{
    public function __construct(
        private SchoolRepository $schoolRepository,
        private HeroSliderRepository $heroSliderRepository,
        private TeacherRepository $teacherRepository,
        private CurriculumRepository $curriculumRepository,
        private StudentActivityRepository $studentActivityRepository,
        private FacilityRepository $facilityRepository,
        private NewsRepository $newsRepository,
        private TestimonialRepository $testimonialRepository,
    ) {}

    public function __invoke(): JsonResponse
    {
        $data = Cache::remember('landing_page_data', 300, function () {
            $baseFilters = ['active' => true, 'ordered' => true];

            $school = $this->schoolRepository->findBySlug('nurul-hikmah');

            $heroSliders = $this->heroSliderRepository->paginate($baseFilters, 10);
            $curriculums = $this->curriculumRepository->paginate(array_merge($baseFilters, ['featured' => true]), 6);

            $teachers = $this->teacherRepository->paginate(array_merge($baseFilters, ['type' => 'guru']), 7);
            $principal = $this->teacherRepository->paginate(array_merge($baseFilters, ['type' => 'kepala_sekolah']), 1);
            $staff = $this->teacherRepository->paginate(array_merge($baseFilters, ['type' => 'staff']), 12);

            $activities = $this->studentActivityRepository->paginate(array_merge($baseFilters, ['featured' => true]), 6);
            $facilities = $this->facilityRepository->paginate(array_merge($baseFilters, ['featured' => true]), 6);
            $news = $this->newsRepository->paginate(array_merge($baseFilters, ['featured' => true]), 3);
            $testimonials = $this->testimonialRepository->paginate(array_merge($baseFilters, ['featured' => true]), 6);

            return [
                'school' => $school ? new SchoolResource($school) : null,
                'hero_sliders' => HeroSliderResource::collection($heroSliders)->resolve(),
                'curriculums' => CurriculumResource::collection($curriculums)->resolve(),
                'teachers' => TeacherResource::collection($teachers)->resolve(),
                'principal' => TeacherResource::collection($principal)->resolve(),
                'staff' => TeacherResource::collection($staff)->resolve(),
                'activities' => StudentActivityResource::collection($activities)->resolve(),
                'facilities' => FacilityResource::collection($facilities)->resolve(),
                'news' => NewsResource::collection($news)->resolve(),
                'testimonials' => TestimonialResource::collection($testimonials)->resolve(),
            ];
        });

        return response()->json(['data' => $data])
            ->header('Cache-Control', 'public, max-age=300');
    }
}
