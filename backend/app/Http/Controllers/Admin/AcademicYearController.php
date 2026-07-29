<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicYear\StoreAcademicYearRequest;
use App\Http\Requests\AcademicYear\UpdateAcademicYearRequest;
use App\Http\Resources\V1\AcademicYearResource;
use App\Repositories\AcademicYearRepository;
use App\Repositories\BaseRepository;
use Illuminate\Http\JsonResponse;

class AcademicYearController extends Controller
{
    use HandlesCrud;

    public function __construct(private AcademicYearRepository $academicYearRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->academicYearRepository;
    }

    protected function resourceClass(): string
    {
        return AcademicYearResource::class;
    }

    public function store(StoreAcademicYearRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateAcademicYearRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
