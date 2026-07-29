<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Admin\Concerns\SyncsStudentActivityPhotos;
use App\Http\Controllers\Controller;
use App\Http\Requests\StudentActivity\StoreStudentActivityRequest;
use App\Http\Requests\StudentActivity\UpdateStudentActivityRequest;
use App\Http\Resources\V1\StudentActivityResource;
use App\Models\StudentActivity;
use App\Repositories\BaseRepository;
use App\Repositories\StudentActivityRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class StudentActivityController extends Controller
{
    use HandlesCrud, SyncsStudentActivityPhotos;

    public function __construct(private StudentActivityRepository $studentActivityRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->studentActivityRepository;
    }

    protected function resourceClass(): string
    {
        return StudentActivityResource::class;
    }

    public function show(StudentActivity $studentActivity): JsonResponse
    {
        $studentActivity->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json(['data' => new StudentActivityResource($studentActivity)]);
    }

    public function store(StoreStudentActivityRequest $request): JsonResponse
    {
        $data = $request->validated();
        $photos = $data['photos'] ?? [];
        unset($data['photos']);
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        $item = $this->studentActivityRepository->create($data);
        $this->syncStudentActivityPhotos($item, $photos);
        $item->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new StudentActivityResource($item),
        ], 201);
    }

    public function update(UpdateStudentActivityRequest $request, StudentActivity $studentActivity): JsonResponse
    {
        $data = $request->validated();
        $photos = $data['photos'] ?? null;
        unset($data['photos']);

        $item = $this->studentActivityRepository->update($studentActivity, $data);

        if (is_array($photos)) {
            $this->syncStudentActivityPhotos($item, $photos);
        }

        $item->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json([
            'message' => 'Data berhasil diperbarui.',
            'data' => new StudentActivityResource($item),
        ]);
    }

    public function destroy(StudentActivity $studentActivity): JsonResponse
    {
        $this->studentActivityRepository->delete($studentActivity);

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }

    public function publish(StudentActivity $studentActivity): JsonResponse
    {
        $item = $this->studentActivityRepository->update($studentActivity, [
            'status' => 'published',
            'is_active' => true,
            'published_at' => $studentActivity->published_at ?? now(),
        ]);
        $item->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json([
            'message' => 'Kegiatan berhasil dipublikasikan.',
            'data' => new StudentActivityResource($item),
        ]);
    }

    public function unpublish(StudentActivity $studentActivity): JsonResponse
    {
        $item = $this->studentActivityRepository->update($studentActivity, [
            'status' => 'draft',
            'published_at' => null,
        ]);
        $item->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json([
            'message' => 'Kegiatan berhasil diarsipkan sebagai draf.',
            'data' => new StudentActivityResource($item),
        ]);
    }
}
