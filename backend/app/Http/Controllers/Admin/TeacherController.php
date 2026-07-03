<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreTeacherRequest;
use App\Http\Requests\Teacher\UpdateTeacherRequest;
use App\Http\Resources\V1\TeacherResource;
use App\Repositories\BaseRepository;
use App\Repositories\TeacherRepository;
use Illuminate\Http\JsonResponse;

class TeacherController extends Controller
{
    use HandlesCrud;

    public function __construct(private TeacherRepository $teacherRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->teacherRepository;
    }

    protected function resourceClass(): string
    {
        return TeacherResource::class;
    }

    public function store(StoreTeacherRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateTeacherRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
