<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\HeroSliderResource;
use App\Repositories\HeroSliderRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroSliderController extends Controller
{
    public function __construct(private HeroSliderRepository $heroSliderRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->heroSliderRepository->all(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]));

        return response()->json(['data' => HeroSliderResource::collection($items)]);
    }
}
