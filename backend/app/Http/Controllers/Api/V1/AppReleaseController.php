<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AppReleaseResource;
use App\Repositories\AppReleaseRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppReleaseController extends Controller
{
    public function __construct(private AppReleaseRepository $appReleaseRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->appReleaseRepository->paginate(array_merge($request->all(), [
            'published' => true,
        ]), (int) $request->get('per_page', 15));

        return AppReleaseResource::collection($items)->response();
    }
}
