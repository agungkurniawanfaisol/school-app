<?php

namespace App\Http\Controllers\Api\V1\Concerns;

use App\Repositories\BaseRepository;
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

        return response()->json($this->resourceClass()::collection($items));
    }

    public function showBySlug(string $slug): JsonResponse
    {
        $item = $this->repository()->findBySlug($slug);

        if (! $item || ! $item->is_active) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new ($this->resourceClass())($item)]);
    }
}
