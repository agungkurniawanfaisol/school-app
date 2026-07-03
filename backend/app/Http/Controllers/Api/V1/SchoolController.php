<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesPublicRead;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SchoolResource;
use App\Repositories\BaseRepository;
use App\Repositories\SchoolRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    use HandlesPublicRead;

    public function __construct(private SchoolRepository $schoolRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->schoolRepository;
    }

    protected function resourceClass(): string
    {
        return SchoolResource::class;
    }

    protected function publicFilters(Request $request): array
    {
        return array_merge($request->all(), ['active' => true]);
    }

    public function show(string $slug): JsonResponse
    {
        $school = $this->schoolRepository->findBySlug($slug);

        if (! $school || ! $school->is_active) {
            return response()->json(['message' => 'Sekolah tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new SchoolResource($school)]);
    }
}
