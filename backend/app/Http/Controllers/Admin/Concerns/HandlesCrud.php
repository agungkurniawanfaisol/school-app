<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

trait HandlesCrud
{
    abstract protected function repository(): BaseRepository;

    /** @return class-string<JsonResource> */
    abstract protected function resourceClass(): string;

    public function index(Request $request): JsonResponse
    {
        $items = $this->repository()->paginate(
            $request->all(),
            (int) $request->get('per_page', 15),
        );

        return $this->resourceClass()::collection($items)->response();
    }

    public function show(int $id): JsonResponse
    {
        $item = $this->repository()->find($id);

        if (! $item) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new ($this->resourceClass())($item)]);
    }

    protected function performStore(FormRequest $request): JsonResponse
    {
        $item = $this->repository()->create($request->validated());

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new ($this->resourceClass())($item),
        ], 201);
    }

    protected function performUpdate(FormRequest $request, int $id): JsonResponse
    {
        $item = $this->repository()->find($id);

        if (! $item instanceof Model) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        return $this->performUpdateOnModel($request, $item);
    }

    protected function performUpdateOnModel(FormRequest $request, Model $item): JsonResponse
    {
        $item = $this->repository()->update($item, $request->validated());

        return response()->json([
            'message' => 'Data berhasil diperbarui.',
            'data' => new ($this->resourceClass())($item),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $item = $this->repository()->find($id);

        if (! $item instanceof Model) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $this->repository()->delete($item);

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }
}
