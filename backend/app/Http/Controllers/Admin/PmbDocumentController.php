<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\PmbDocument\StorePmbDocumentRequest;
use App\Http\Requests\PmbDocument\UpdatePmbDocumentRequest;
use App\Http\Resources\V1\PmbDocumentResource;
use App\Repositories\BaseRepository;
use App\Repositories\PmbDocumentRepository;
use Illuminate\Http\JsonResponse;

class PmbDocumentController extends Controller
{
    use HandlesCrud;

    public function __construct(private PmbDocumentRepository $pmbDocumentRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->pmbDocumentRepository;
    }

    protected function resourceClass(): string
    {
        return PmbDocumentResource::class;
    }

    public function store(StorePmbDocumentRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdatePmbDocumentRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
