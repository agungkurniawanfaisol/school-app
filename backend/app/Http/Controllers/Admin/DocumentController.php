<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Requests\Document\UpdateDocumentRequest;
use App\Http\Resources\V1\DocumentResource;
use App\Repositories\BaseRepository;
use App\Repositories\DocumentRepository;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    use HandlesCrud;

    public function __construct(private DocumentRepository $documentRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->documentRepository;
    }

    protected function resourceClass(): string
    {
        return DocumentResource::class;
    }

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateDocumentRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
