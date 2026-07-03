<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\VirtualTourListResource;
use App\Http\Resources\V1\VirtualTourResource;
use App\Repositories\VirtualTourRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;

class VirtualTourController extends Controller
{
    public function __construct(private VirtualTourRepository $virtualTourRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->virtualTourRepository->paginate(
            array_merge($request->all(), ['is_active' => true]),
            min((int) $request->get('per_page', 15), 50),
        );

        return VirtualTourListResource::collection($items)->response();
    }

    public function showBySlug(string $slug): JsonResponse
    {
        $tour = $this->virtualTourRepository->findBySlug($slug, ['scenes.hotspots.targetScene', 'startScene']);

        if (! $tour instanceof Model || ! $tour->is_active) {
            return response()->json(['message' => 'Virtual tour tidak ditemukan.'], 404);
        }

        if ($tour->scenes->isEmpty()) {
            return response()->json(['message' => 'Virtual tour tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new VirtualTourResource($tour)]);
    }
}
