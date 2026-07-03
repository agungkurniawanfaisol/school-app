<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\HeroSlider\StoreHeroSliderRequest;
use App\Http\Requests\HeroSlider\UpdateHeroSliderRequest;
use App\Http\Resources\V1\HeroSliderResource;
use App\Repositories\BaseRepository;
use App\Repositories\HeroSliderRepository;
use Illuminate\Http\JsonResponse;

class HeroSliderController extends Controller
{
    use HandlesCrud;

    public function __construct(private HeroSliderRepository $heroSliderRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->heroSliderRepository;
    }

    protected function resourceClass(): string
    {
        return HeroSliderResource::class;
    }

    public function store(StoreHeroSliderRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateHeroSliderRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
