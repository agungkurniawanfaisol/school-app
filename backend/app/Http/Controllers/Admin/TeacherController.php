<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreTeacherRequest;
use App\Http\Requests\Teacher\UpdateTeacherRequest;
use App\Http\Resources\V1\TeacherResource;
use App\Models\Teacher;
use App\Repositories\BaseRepository;
use App\Repositories\TeacherRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

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

    public function show(Teacher $teacher): JsonResponse
    {
        $teacher->load('user:id,teacher_id,name,email');

        return response()->json(['data' => new TeacherResource($teacher)]);
    }

    public function store(StoreTeacherRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $item = $this->teacherRepository->create($data);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new TeacherResource($item),
        ], 201);
    }

    public function update(UpdateTeacherRequest $request, Teacher $teacher): JsonResponse
    {
        return $this->performUpdateOnModel($request, $teacher);
    }

    public function destroy(Teacher $teacher): JsonResponse
    {
        $this->teacherRepository->delete($teacher);

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }
}
