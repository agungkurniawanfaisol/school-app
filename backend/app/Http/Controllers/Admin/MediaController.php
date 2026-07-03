<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Media\StoreMediaRequest;
use App\Http\Requests\Media\UpdateMediaRequest;
use App\Http\Resources\V1\MediaResource;
use App\Repositories\BaseRepository;
use App\Repositories\MediaRepository;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    use HandlesCrud;

    public function __construct(private MediaRepository $mediaRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->mediaRepository;
    }

    protected function resourceClass(): string
    {
        return MediaResource::class;
    }

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $data['user_id'] ?? $request->user()?->id;

        $item = $this->mediaRepository->create($data);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new MediaResource($item),
        ], 201);
    }

    public function update(UpdateMediaRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
