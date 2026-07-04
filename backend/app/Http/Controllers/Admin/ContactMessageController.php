<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ContactMessageResource;
use App\Repositories\ContactMessageRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function __construct(private ContactMessageRepository $contactMessageRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->contactMessageRepository->paginate(
            $request->all(),
            (int) $request->get('per_page', 15)
        );

        return ContactMessageResource::collection($items)->response();
    }

    public function show(int $id): JsonResponse
    {
        $message = $this->contactMessageRepository->find($id);
        if (!$message) {
            abort(404);
        }

        if (!$message->is_read) {
            $this->contactMessageRepository->update($message, [
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return (new ContactMessageResource($message))->response();
    }

    public function destroy(int $id): JsonResponse
    {
        $message = $this->contactMessageRepository->find($id);
        if (!$message) {
            abort(404);
        }

        $this->contactMessageRepository->delete($message);

        return response()->json(['message' => 'Pesan berhasil dihapus.']);
    }

    public function markAsRead(int $id): JsonResponse
    {
        $message = $this->contactMessageRepository->find($id);
        if (!$message) {
            abort(404);
        }

        $this->contactMessageRepository->update($message, [
            'is_read' => true,
            'read_at' => now(),
        ]);

        return (new ContactMessageResource($message))->response();
    }
}
