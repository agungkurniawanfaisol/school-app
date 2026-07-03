<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Facility\StoreFacilityRequest;
use App\Http\Requests\Facility\UpdateFacilityRequest;
use App\Http\Resources\V1\FacilityResource;
use App\Repositories\BaseRepository;
use App\Repositories\FacilityRepository;
use Illuminate\Http\JsonResponse;

class FacilityController extends Controller
{
    use HandlesCrud;

    public function __construct(private FacilityRepository $facilityRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->facilityRepository;
    }

    protected function resourceClass(): string
    {
        return FacilityResource::class;
    }

    public function store(StoreFacilityRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateFacilityRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
