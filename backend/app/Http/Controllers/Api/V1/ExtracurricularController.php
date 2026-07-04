<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ExtracurricularResource;
use App\Repositories\ExtracurricularRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExtracurricularController extends Controller
{
    public function __construct(private ExtracurricularRepository $extracurricularRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->extracurricularRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return ExtracurricularResource::collection($items)->response();
    }

    public function show(string $uuid): JsonResponse
    {
        $item = $this->extracurricularRepository->findByUuid($uuid);

        if (!$item || !$item->is_active) {
            abort(404);
        }

        return (new ExtracurricularResource($item))->response();
    }
}
