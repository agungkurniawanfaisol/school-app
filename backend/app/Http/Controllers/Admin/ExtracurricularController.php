<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Extracurricular\StoreExtracurricularRequest;
use App\Http\Requests\Extracurricular\UpdateExtracurricularRequest;
use App\Http\Resources\V1\ExtracurricularResource;
use App\Repositories\BaseRepository;
use App\Repositories\ExtracurricularRepository;
use Illuminate\Http\JsonResponse;

class ExtracurricularController extends Controller
{
    use HandlesCrud;

    public function __construct(private ExtracurricularRepository $extracurricularRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->extracurricularRepository;
    }

    protected function resourceClass(): string
    {
        return ExtracurricularResource::class;
    }

    public function store(StoreExtracurricularRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateExtracurricularRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
