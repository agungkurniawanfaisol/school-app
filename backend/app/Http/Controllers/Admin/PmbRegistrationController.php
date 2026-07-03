<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\PmbRegistration\StorePmbRegistrationRequest;
use App\Http\Requests\PmbRegistration\UpdatePmbRegistrationRequest;
use App\Http\Resources\V1\PmbRegistrationResource;
use App\Repositories\BaseRepository;
use App\Repositories\PmbRegistrationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PmbRegistrationController extends Controller
{
    use HandlesCrud;

    public function __construct(private PmbRegistrationRepository $pmbRegistrationRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->pmbRegistrationRepository;
    }

    protected function resourceClass(): string
    {
        return PmbRegistrationResource::class;
    }

    public function store(StorePmbRegistrationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tracking_token'] = Str::random(64);

        $item = $this->pmbRegistrationRepository->create($data);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new PmbRegistrationResource($item),
        ], 201);
    }

    public function update(UpdatePmbRegistrationRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
