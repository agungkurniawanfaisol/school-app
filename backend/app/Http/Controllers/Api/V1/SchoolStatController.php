<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SchoolStatResource;
use App\Repositories\SchoolStatRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolStatController extends Controller
{
    public function __construct(private SchoolStatRepository $schoolStatRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->schoolStatRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return SchoolStatResource::collection($items)->response();
    }
}
