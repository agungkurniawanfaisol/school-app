<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\FaqResource;
use App\Repositories\FaqRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function __construct(private FaqRepository $faqRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->faqRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return FaqResource::collection($items)->response();
    }
}
