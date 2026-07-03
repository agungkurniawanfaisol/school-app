<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\School\StoreSchoolRequest;
use App\Http\Requests\School\UpdateSchoolRequest;
use App\Http\Resources\V1\SchoolResource;
use App\Repositories\BaseRepository;
use App\Repositories\SchoolRepository;
use Illuminate\Http\JsonResponse;

class SchoolController extends Controller
{
    use HandlesCrud;

    public function __construct(private SchoolRepository $schoolRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->schoolRepository;
    }

    protected function resourceClass(): string
    {
        return SchoolResource::class;
    }

    public function store(StoreSchoolRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateSchoolRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
