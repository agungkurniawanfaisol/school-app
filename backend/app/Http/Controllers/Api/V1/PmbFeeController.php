<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PmbFeeResource;
use App\Models\School;
use App\Repositories\PmbFeeRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PmbFeeController extends Controller
{
    public function __construct(private PmbFeeRepository $pmbFeeRepository) {}

    public function active(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json(['message' => 'Data sekolah tidak ditemukan.'], 404);
        }

        $fee = $this->pmbFeeRepository->findActiveForSchool($schoolId);
        if ($fee === null) {
            return response()->json(['message' => 'Biaya pendaftaran aktif belum diatur.'], 404);
        }

        return response()->json(['data' => new PmbFeeResource($fee)]);
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
