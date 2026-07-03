<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\VirtualTour\StoreVirtualTourRequest;
use App\Http\Requests\VirtualTour\UpdateVirtualTourRequest;
use App\Http\Resources\V1\VirtualTourResource;
use App\Models\VirtualTour;
use App\Repositories\BaseRepository;
use App\Repositories\VirtualTourRepository;
use App\Services\VirtualTourSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VirtualTourController extends Controller
{
    use HandlesCrud;

    public function __construct(
        private VirtualTourRepository $virtualTourRepository,
        private VirtualTourSyncService $syncService,
    ) {}

    protected function repository(): BaseRepository
    {
        return $this->virtualTourRepository;
    }

    protected function resourceClass(): string
    {
        return VirtualTourResource::class;
    }

    public function show(VirtualTour $virtualTour): JsonResponse
    {
        $virtualTour->load(['scenes.hotspots.targetScene', 'startScene']);

        return response()->json(['data' => new VirtualTourResource($virtualTour)]);
    }

    public function store(StoreVirtualTourRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? VirtualTourSyncService::uniqueSlug($data['title']);

        $tour = $this->virtualTourRepository->create([
            'school_id' => $data['school_id'],
            'title' => $data['title'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'order' => $data['order'] ?? 0,
        ]);

        if (! empty($data['scenes'])) {
            $tour = $this->syncService->sync($tour, $data);
        }

        return response()->json([
            'message' => 'Virtual tour berhasil ditambahkan.',
            'data' => new VirtualTourResource($tour->load(['scenes.hotspots.targetScene', 'startScene'])),
        ], 201);
    }

    public function update(UpdateVirtualTourRequest $request, VirtualTour $virtualTour): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['slug'])) {
            $data['slug'] = $this->resolveUniqueSlug($data['slug'], $virtualTour->id);
        }

        $tour = $this->syncService->sync($virtualTour, array_merge($data, [
            'title' => $data['title'] ?? $virtualTour->title,
            'slug' => $data['slug'] ?? $virtualTour->slug,
            'description' => $data['description'] ?? $virtualTour->description,
            'is_active' => $data['is_active'] ?? $virtualTour->is_active,
            'order' => $data['order'] ?? $virtualTour->order,
            'scenes' => $data['scenes'] ?? [],
        ]));

        return response()->json([
            'message' => 'Virtual tour berhasil diperbarui.',
            'data' => new VirtualTourResource($tour->load(['scenes.hotspots.targetScene', 'startScene'])),
        ]);
    }

    public function destroy(VirtualTour $virtualTour): JsonResponse
    {
        $this->virtualTourRepository->delete($virtualTour);

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }

    private function resolveUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = \Illuminate\Support\Str::slug(\Illuminate\Support\Str::limit($slug, 200, ''));
        $candidate = $base;
        $counter = 1;

        while (
            VirtualTour::query()
                ->when($ignoreId !== null, fn ($q) => $q->whereKeyNot($ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $base.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }
}
