<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Admin\Concerns\SyncsFacilityPhotos;
use App\Http\Controllers\Controller;
use App\Http\Requests\Facility\StoreFacilityRequest;
use App\Http\Requests\Facility\UpdateFacilityRequest;
use App\Http\Resources\V1\FacilityResource;
use App\Models\Facility;
use App\Repositories\BaseRepository;
use App\Repositories\FacilityRepository;
use Illuminate\Http\JsonResponse;

class FacilityController extends Controller
{
    use HandlesCrud, SyncsFacilityPhotos;

    public function __construct(private FacilityRepository $facilityRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->facilityRepository;
    }

    protected function resourceClass(): string
    {
        return FacilityResource::class;
    }

    public function show(Facility $facility): JsonResponse
    {
        $facility->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json(['data' => new FacilityResource($facility)]);
    }

    public function store(StoreFacilityRequest $request): JsonResponse
    {
        $data = $request->validated();
        $photos = $data['photos'] ?? [];
        unset($data['photos']);

        $item = $this->facilityRepository->create($data);
        $this->syncFacilityPhotos($item, $photos);
        $item->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new FacilityResource($item),
        ], 201);
    }

    public function update(UpdateFacilityRequest $request, Facility $facility): JsonResponse
    {
        $data = $request->validated();
        $photos = $data['photos'] ?? null;
        unset($data['photos']);

        $item = $this->facilityRepository->update($facility, $data);

        if (is_array($photos)) {
            $this->syncFacilityPhotos($item, $photos);
        }

        $item->load(['photos' => fn ($q) => $q->orderBy('order')]);

        return response()->json([
            'message' => 'Data berhasil diperbarui.',
            'data' => new FacilityResource($item),
        ]);
    }

    public function destroy(Facility $facility): JsonResponse
    {
        $this->facilityRepository->delete($facility);

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }
}
