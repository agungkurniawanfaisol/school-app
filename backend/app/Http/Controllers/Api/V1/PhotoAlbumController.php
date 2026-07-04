<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PhotoAlbumResource;
use App\Repositories\PhotoAlbumRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PhotoAlbumController extends Controller
{
    public function __construct(private PhotoAlbumRepository $photoAlbumRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->photoAlbumRepository->paginate(array_merge($request->all(), [
            'active' => true,
            'ordered' => true,
        ]), (int) $request->get('per_page', 15));

        return PhotoAlbumResource::collection($items)->response();
    }

    public function show(string $uuid): JsonResponse
    {
        $album = $this->photoAlbumRepository->findByUuid($uuid, ['photos']);

        if (!$album || !$album->is_active) {
            abort(404);
        }

        return (new PhotoAlbumResource($album))->response();
    }
}
