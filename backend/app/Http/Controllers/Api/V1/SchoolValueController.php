<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SchoolValueResource;
use App\Repositories\SchoolValueRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolValueController extends Controller
{
    public function __construct(private SchoolValueRepository $schoolValueRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->schoolValueRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return SchoolValueResource::collection($items)->response();
    }
}
