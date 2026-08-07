<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\PmbProgram\StorePmbProgramRequest;
use App\Http\Requests\PmbProgram\UpdatePmbProgramRequest;
use App\Http\Resources\V1\PmbProgramResource;
use App\Repositories\BaseRepository;
use App\Repositories\PmbProgramRepository;
use Illuminate\Http\JsonResponse;

class PmbProgramController extends Controller
{
    use HandlesCrud;

    public function __construct(private PmbProgramRepository $pmbProgramRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->pmbProgramRepository;
    }

    protected function resourceClass(): string
    {
        return PmbProgramResource::class;
    }

    public function store(StorePmbProgramRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdatePmbProgramRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
