<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseEnrollment\StoreCourseEnrollmentRequest;
use App\Http\Requests\CourseEnrollment\UpdateCourseEnrollmentRequest;
use App\Http\Resources\V1\CourseEnrollmentResource;
use App\Repositories\BaseRepository;
use App\Repositories\CourseEnrollmentRepository;
use Illuminate\Http\JsonResponse;

class CourseEnrollmentController extends Controller
{
    use HandlesCrud;

    public function __construct(private CourseEnrollmentRepository $courseEnrollmentRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->courseEnrollmentRepository;
    }

    protected function resourceClass(): string
    {
        return CourseEnrollmentResource::class;
    }

    public function store(StoreCourseEnrollmentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['enrolled_at'] = $data['enrolled_at'] ?? now();

        $item = $this->courseEnrollmentRepository->create($data);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new CourseEnrollmentResource($item),
        ], 201);
    }

    public function update(UpdateCourseEnrollmentRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
