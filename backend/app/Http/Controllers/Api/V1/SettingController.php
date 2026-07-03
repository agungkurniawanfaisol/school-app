<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SettingResource;
use App\Repositories\SettingRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct(private SettingRepository $settingRepository) {}

    public function index(Request $request): JsonResponse
    {
        $group = $request->get('group', 'general');
        $schoolId = $request->get('school_id') ? (int) $request->get('school_id') : null;

        $settings = $this->settingRepository->getByGroup($schoolId, $group);

        return response()->json(['data' => SettingResource::collection($settings)]);
    }
}
