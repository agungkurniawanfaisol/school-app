<?php

namespace App\Http\Controllers\Api\V1\Concerns;

use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

trait HandlesPublicRead
{
    abstract protected function repository(): BaseRepository;

    /** @return class-string<JsonResource> */
    abstract protected function resourceClass(): string;

    protected function defaultPublicFilters(Request $request): array
    {
        return array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]);
    }

    protected function publicFilters(Request $request): array
    {
        return $this->defaultPublicFilters($request);
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->repository()->paginate(
            $this->publicFilters($request),
            (int) $request->get('per_page', 15),
        );

        return $this->resourceClass()::collection($items)->response();
    }

    public function showBySlug(string $slug): JsonResponse
    {
        $item = $this->repository()->findBySlug($slug);

        if (! $item instanceof Model || ! $this->isPubliclyVisible($item)) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new ($this->resourceClass())($item)]);
    }

    public function showByUuid(string $uuid): JsonResponse
    {
        $item = $this->repository()->findByUuid($uuid);

        if (! $item instanceof Model || ! $this->isPubliclyVisible($item)) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new ($this->resourceClass())($item)]);
    }

    protected function isPubliclyVisible(Model $item): bool
    {
        if ($item instanceof \App\Models\News) {
            return \App\Support\NewsPublishSchedule::isPubliclyVisible($item);
        }

        if (! $item->is_active) {
            return false;
        }

        if (in_array('status', $item->getFillable(), true) && $item->status !== 'published') {
            return false;
        }

        if (in_array('published_at', $item->getFillable(), true) && in_array('status', $item->getFillable(), true)) {
            if ($item->published_at === null || $item->published_at->isFuture()) {
                return false;
            }
        }

        return true;
    }
}
