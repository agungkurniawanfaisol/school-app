<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Http\Resources\V1\NewsResource;
use App\Repositories\BaseRepository;
use App\Repositories\NewsRepository;
use Illuminate\Http\JsonResponse;

class NewsController extends Controller
{
    use HandlesCrud;

    public function __construct(private NewsRepository $newsRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->newsRepository;
    }

    protected function resourceClass(): string
    {
        return NewsResource::class;
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $data['user_id'] ?? $request->user()?->id;

        $item = $this->newsRepository->create($data);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new NewsResource($item),
        ], 201);
    }

    public function update(UpdateNewsRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
