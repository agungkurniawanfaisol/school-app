<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseModule\StoreCourseModuleRequest;
use App\Http\Requests\CourseModule\UpdateCourseModuleRequest;
use App\Http\Resources\V1\CourseModuleResource;
use App\Repositories\BaseRepository;
use App\Repositories\CourseModuleRepository;
use Illuminate\Http\JsonResponse;

class CourseModuleController extends Controller
{
    use HandlesCrud;

    public function __construct(private CourseModuleRepository $courseModuleRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->courseModuleRepository;
    }

    protected function resourceClass(): string
    {
        return CourseModuleResource::class;
    }

    public function store(StoreCourseModuleRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateCourseModuleRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
