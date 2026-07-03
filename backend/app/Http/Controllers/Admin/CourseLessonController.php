<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseLesson\StoreCourseLessonRequest;
use App\Http\Requests\CourseLesson\UpdateCourseLessonRequest;
use App\Http\Resources\V1\CourseLessonResource;
use App\Repositories\BaseRepository;
use App\Repositories\CourseLessonRepository;
use Illuminate\Http\JsonResponse;

class CourseLessonController extends Controller
{
    use HandlesCrud;

    public function __construct(private CourseLessonRepository $courseLessonRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->courseLessonRepository;
    }

    protected function resourceClass(): string
    {
        return CourseLessonResource::class;
    }

    public function store(StoreCourseLessonRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateCourseLessonRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
