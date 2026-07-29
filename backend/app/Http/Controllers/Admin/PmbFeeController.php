<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\PmbFee\StorePmbFeeRequest;
use App\Http\Requests\PmbFee\UpdatePmbFeeRequest;
use App\Http\Resources\V1\PmbFeeResource;
use App\Repositories\BaseRepository;
use App\Repositories\PmbFeeRepository;
use Illuminate\Http\JsonResponse;

class PmbFeeController extends Controller
{
    use HandlesCrud;

    public function __construct(private PmbFeeRepository $pmbFeeRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->pmbFeeRepository;
    }

    protected function resourceClass(): string
    {
        return PmbFeeResource::class;
    }

    public function store(StorePmbFeeRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdatePmbFeeRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }

    public function destroy(int $id): JsonResponse
    {
        $item = $this->repository()->find($id);

        if ($item === null) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        try {
            $this->repository()->delete($item);
        } catch (\InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }
}
