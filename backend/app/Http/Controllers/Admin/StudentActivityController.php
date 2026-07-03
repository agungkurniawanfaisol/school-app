<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\StudentActivity\StoreStudentActivityRequest;
use App\Http\Requests\StudentActivity\UpdateStudentActivityRequest;
use App\Http\Resources\V1\StudentActivityResource;
use App\Repositories\BaseRepository;
use App\Repositories\StudentActivityRepository;
use Illuminate\Http\JsonResponse;

class StudentActivityController extends Controller
{
    use HandlesCrud;

    public function __construct(private StudentActivityRepository $studentActivityRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->studentActivityRepository;
    }

    protected function resourceClass(): string
    {
        return StudentActivityResource::class;
    }

    public function store(StoreStudentActivityRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateStudentActivityRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
