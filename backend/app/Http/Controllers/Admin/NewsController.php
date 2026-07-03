<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\News\PublishNewsRequest;
use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Http\Resources\V1\NewsResource;
use App\Models\News;
use App\Repositories\BaseRepository;
use App\Repositories\NewsRepository;
use App\Services\PublishingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    use HandlesCrud;

    public function __construct(
        private NewsRepository $newsRepository,
        private PublishingService $publishingService,
    ) {}

    protected function repository(): BaseRepository
    {
        return $this->newsRepository;
    }

    protected function resourceClass(): string
    {
        return NewsResource::class;
    }

    public function show(News $news): JsonResponse
    {
        return response()->json(['data' => new NewsResource($news)]);
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $data['user_id'] ?? $request->user()?->id;
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

        $item = $this->newsRepository->create($data);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new NewsResource($item),
        ], 201);
    }

    public function update(UpdateNewsRequest $request, News $news): JsonResponse
    {
        return $this->performUpdateOnModel($request, $news);
    }

    public function destroy(News $news): JsonResponse
    {
        $this->newsRepository->delete($news);

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }

    public function publish(PublishNewsRequest $request, News $news): JsonResponse
    {
        $validated = $request->validated();

        $item = $this->publishingService->publish($news, [
            'published_at' => $validated['published_at'] ?? now(),
            'publish_ends_at' => $validated['publish_ends_at'] ?? null,
        ]);

        return response()->json([
            'message' => 'Berita berhasil dipublikasikan.',
            'data' => new NewsResource($item),
        ]);
    }

    public function unpublish(News $news): JsonResponse
    {
        $item = $this->publishingService->unpublish($news);

        return response()->json([
            'message' => 'Berita berhasil diarsipkan sebagai draf.',
            'data' => new NewsResource($item),
        ]);
    }
}
