<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AcademicYearResource;
use App\Models\School;
use App\Repositories\AcademicYearRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function __construct(private AcademicYearRepository $academicYearRepository) {}

    public function active(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json(['message' => 'Data sekolah tidak ditemukan.'], 404);
        }

        $year = $this->academicYearRepository->findActiveForSchool($schoolId);
        if ($year === null) {
            return response()->json(['message' => 'Tahun ajaran aktif belum diatur.'], 404);
        }

        return response()->json(['data' => new AcademicYearResource($year)]);
    }

    private function resolveSchoolId(Request $request): ?int
    {
        $requestedId = $request->input('school_id');
        if (is_numeric($requestedId) && (int) $requestedId > 0) {
            $id = School::query()
                ->whereKey((int) $requestedId)
                ->where('is_active', true)
                ->value('id');

            return $id ? (int) $id : null;
        }

        $id = School::query()
            ->where('slug', 'nurul-hikmah')
            ->where('is_active', true)
            ->value('id')
            ?? School::query()->where('is_active', true)->orderBy('id')->value('id');

        return $id ? (int) $id : null;
    }
}
