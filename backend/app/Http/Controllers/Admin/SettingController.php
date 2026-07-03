<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Setting\StoreSettingRequest;
use App\Http\Requests\Setting\UpdateSettingRequest;
use App\Http\Resources\V1\SettingResource;
use App\Repositories\BaseRepository;
use App\Repositories\SettingRepository;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    use HandlesCrud;

    public function __construct(private SettingRepository $settingRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->settingRepository;
    }

    protected function resourceClass(): string
    {
        return SettingResource::class;
    }

    public function store(StoreSettingRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateSettingRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
