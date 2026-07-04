<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactMessage\StoreContactMessageRequest;
use App\Repositories\ContactMessageRepository;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    public function __construct(private ContactMessageRepository $contactMessageRepository) {}

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $this->contactMessageRepository->create($request->validated());

        return response()->json(['message' => 'Pesan berhasil dikirim. Terima kasih!'], 201);
    }
}
