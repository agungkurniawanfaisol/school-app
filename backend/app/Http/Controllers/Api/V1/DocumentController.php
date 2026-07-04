<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\DocumentResource;
use App\Repositories\DocumentRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function __construct(private DocumentRepository $documentRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->documentRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return DocumentResource::collection($items)->response();
    }
}
