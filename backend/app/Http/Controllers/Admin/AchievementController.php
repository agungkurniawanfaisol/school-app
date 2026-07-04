<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Achievement\StoreAchievementRequest;
use App\Http\Requests\Achievement\UpdateAchievementRequest;
use App\Http\Resources\V1\AchievementResource;
use App\Repositories\AchievementRepository;
use App\Repositories\BaseRepository;
use Illuminate\Http\JsonResponse;

class AchievementController extends Controller
{
    use HandlesCrud;

    public function __construct(private AchievementRepository $achievementRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->achievementRepository;
    }

    protected function resourceClass(): string
    {
        return AchievementResource::class;
    }

    public function store(StoreAchievementRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateAchievementRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
