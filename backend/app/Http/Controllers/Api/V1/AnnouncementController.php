<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AnnouncementResource;
use App\Repositories\AnnouncementRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function __construct(private AnnouncementRepository $announcementRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->announcementRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return AnnouncementResource::collection($items)->response();
    }
}
