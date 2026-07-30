<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PmbEmail\BroadcastPmbEmailRequest;
use App\Http\Requests\PmbEmail\SendPmbEmailRequest;
use App\Services\PmbEmailService;
use Illuminate\Http\JsonResponse;

class PmbEmailController extends Controller
{
    public function __construct(private PmbEmailService $pmbEmailService) {}

    public function send(SendPmbEmailRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->pmbEmailService->queueCustom(
            $data['registration_uuids'],
            $data['subject'],
            $data['body'],
        );

        return response()->json([
            'message' => 'Email berhasil dijadwalkan.',
            'data' => $result,
        ]);
    }

    public function broadcast(BroadcastPmbEmailRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->pmbEmailService->queueBroadcast(
            $data['status'] ?? 'all',
            $data['subject'],
            $data['body'],
        );

        return response()->json([
            'message' => 'Broadcast email berhasil dijadwalkan.',
            'data' => $result,
        ]);
    }
}
