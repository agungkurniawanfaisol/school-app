<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolValue\StoreSchoolValueRequest;
use App\Http\Requests\SchoolValue\UpdateSchoolValueRequest;
use App\Http\Resources\V1\SchoolValueResource;
use App\Models\SchoolValue;
use App\Repositories\BaseRepository;
use App\Repositories\SchoolValueRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SchoolValueController extends Controller
{
    use HandlesCrud;

    public function __construct(private SchoolValueRepository $schoolValueRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->schoolValueRepository;
    }

    protected function resourceClass(): string
    {
        return SchoolValueResource::class;
    }

    public function show(SchoolValue $schoolValue): JsonResponse
    {
        return response()->json(['data' => new SchoolValueResource($schoolValue)]);
    }

    public function store(StoreSchoolValueRequest $request): JsonResponse
    {
        $response = $this->performStore($request);
        $this->forgetLandingCache();

        return $response;
    }

    public function update(UpdateSchoolValueRequest $request, SchoolValue $schoolValue): JsonResponse
    {
        $response = $this->performUpdateOnModel($request, $schoolValue);
        $this->forgetLandingCache();

        return $response;
    }

    public function destroy(SchoolValue $schoolValue): JsonResponse
    {
        $this->schoolValueRepository->delete($schoolValue);
        $this->forgetLandingCache();

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }

    private function forgetLandingCache(): void
    {
        Cache::forget('landing_page_data');
    }
}
