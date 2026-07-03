<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\PmbRegistration\PublicStorePmbRegistrationRequest;
use App\Http\Resources\V1\PmbRegistrationResource;
use App\Repositories\PmbRegistrationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PmbRegistrationController extends Controller
{
    public function __construct(private PmbRegistrationRepository $pmbRegistrationRepository) {}

    public function store(PublicStorePmbRegistrationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['registration_number'] = 'PMB-'.now()->format('Ymd').'-'.strtoupper(Str::random(6));
        $data['tracking_token'] = Str::random(64);
        $data['status'] = 'pending';

        $registration = $this->pmbRegistrationRepository->create($data);

        return response()->json([
            'message' => 'Pendaftaran berhasil dikirim.',
            'data' => new PmbRegistrationResource($registration),
        ], 201);
    }

    public function track(string $token): JsonResponse
    {
        $registration = $this->pmbRegistrationRepository->findByTrackingToken($token);

        if (! $registration) {
            return response()->json(['message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new PmbRegistrationResource($registration)]);
    }
}
