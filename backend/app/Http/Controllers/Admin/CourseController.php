<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Http\Resources\V1\CourseResource;
use App\Repositories\BaseRepository;
use App\Repositories\CourseRepository;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    use HandlesCrud;

    public function __construct(private CourseRepository $courseRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->courseRepository;
    }

    protected function resourceClass(): string
    {
        return CourseResource::class;
    }

    public function store(StoreCourseRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateCourseRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
