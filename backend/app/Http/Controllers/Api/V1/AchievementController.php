<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AchievementResource;
use App\Repositories\AchievementRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function __construct(private AchievementRepository $achievementRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->achievementRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return AchievementResource::collection($items)->response();
    }

    public function show(string $uuid): JsonResponse
    {
        $item = $this->achievementRepository->findByUuid($uuid);

        if (!$item || !$item->is_active) {
            abort(404);
        }

        return (new AchievementResource($item))->response();
    }
}
