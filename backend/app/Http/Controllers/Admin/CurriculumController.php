<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Curriculum\StoreCurriculumRequest;
use App\Http\Requests\Curriculum\UpdateCurriculumRequest;
use App\Http\Resources\V1\CurriculumResource;
use App\Repositories\BaseRepository;
use App\Repositories\CurriculumRepository;
use Illuminate\Http\JsonResponse;

class CurriculumController extends Controller
{
    use HandlesCrud;

    public function __construct(private CurriculumRepository $curriculumRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->curriculumRepository;
    }

    protected function resourceClass(): string
    {
        return CurriculumResource::class;
    }

    public function store(StoreCurriculumRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateCurriculumRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
