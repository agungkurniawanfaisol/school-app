<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseProgress\StoreCourseProgressRequest;
use App\Http\Requests\CourseProgress\UpdateCourseProgressRequest;
use App\Http\Resources\V1\CourseProgressResource;
use App\Repositories\BaseRepository;
use App\Repositories\CourseProgressRepository;
use Illuminate\Http\JsonResponse;

class CourseProgressController extends Controller
{
    use HandlesCrud;

    public function __construct(private CourseProgressRepository $courseProgressRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->courseProgressRepository;
    }

    protected function resourceClass(): string
    {
        return CourseProgressResource::class;
    }

    public function store(StoreCourseProgressRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateCourseProgressRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
