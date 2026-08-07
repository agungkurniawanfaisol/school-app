<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppRelease\StoreAppReleaseRequest;
use App\Http\Requests\AppRelease\UpdateAppReleaseRequest;
use App\Http\Resources\V1\AppReleaseResource;
use App\Repositories\AppReleaseRepository;
use App\Repositories\BaseRepository;
use Illuminate\Http\JsonResponse;

class AppReleaseController extends Controller
{
    use HandlesCrud;

    public function __construct(private AppReleaseRepository $appReleaseRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->appReleaseRepository;
    }

    protected function resourceClass(): string
    {
        return AppReleaseResource::class;
    }

    public function store(StoreAppReleaseRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateAppReleaseRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
