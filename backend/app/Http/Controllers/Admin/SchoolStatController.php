<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolStat\StoreSchoolStatRequest;
use App\Http\Requests\SchoolStat\UpdateSchoolStatRequest;
use App\Http\Resources\V1\SchoolStatResource;
use App\Models\SchoolStat;
use App\Repositories\BaseRepository;
use App\Repositories\SchoolStatRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SchoolStatController extends Controller
{
    use HandlesCrud;

    public function __construct(private SchoolStatRepository $schoolStatRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->schoolStatRepository;
    }

    protected function resourceClass(): string
    {
        return SchoolStatResource::class;
    }

    public function show(SchoolStat $schoolStat): JsonResponse
    {
        return response()->json(['data' => new SchoolStatResource($schoolStat)]);
    }

    public function store(StoreSchoolStatRequest $request): JsonResponse
    {
        $response = $this->performStore($request);
        $this->forgetLandingCache();

        return $response;
    }

    public function update(UpdateSchoolStatRequest $request, SchoolStat $schoolStat): JsonResponse
    {
        $response = $this->performUpdateOnModel($request, $schoolStat);
        $this->forgetLandingCache();

        return $response;
    }

    public function destroy(SchoolStat $schoolStat): JsonResponse
    {
        $this->schoolStatRepository->delete($schoolStat);
        $this->forgetLandingCache();

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }

    private function forgetLandingCache(): void
    {
        Cache::forget('landing_page_data');
    }
}
