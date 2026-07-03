<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesPublicRead;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\FacilityResource;
use App\Repositories\BaseRepository;
use App\Repositories\FacilityRepository;

class FacilityController extends Controller
{
    use HandlesPublicRead;

    public function __construct(private FacilityRepository $facilityRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->facilityRepository;
    }

    protected function resourceClass(): string
    {
        return FacilityResource::class;
    }
}
