<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\PhotoAlbum\StorePhotoAlbumRequest;
use App\Http\Requests\PhotoAlbum\UpdatePhotoAlbumRequest;
use App\Http\Resources\V1\PhotoAlbumResource;
use App\Models\AlbumPhoto;
use App\Repositories\BaseRepository;
use App\Repositories\PhotoAlbumRepository;
use Illuminate\Http\JsonResponse;

class PhotoAlbumController extends Controller
{
    use HandlesCrud;

    public function __construct(private PhotoAlbumRepository $photoAlbumRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->photoAlbumRepository;
    }

    protected function resourceClass(): string
    {
        return PhotoAlbumResource::class;
    }

    public function store(StorePhotoAlbumRequest $request): JsonResponse
    {
        $data = $request->validated();
        $photos = $data['photos'] ?? [];
        unset($data['photos']);

        $album = $this->photoAlbumRepository->create($data);

        foreach ($photos as $index => $photoData) {
            $album->photos()->create([
                'url' => $photoData['url'],
                'caption' => $photoData['caption'] ?? null,
                'order' => $photoData['order'] ?? $index,
            ]);
        }

        $album->load('photos');

        return (new PhotoAlbumResource($album))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePhotoAlbumRequest $request, int $id): JsonResponse
    {
        $album = $this->photoAlbumRepository->find($id);
        if (!$album) {
            abort(404);
        }

        $data = $request->validated();
        $photos = $data['photos'] ?? null;
        unset($data['photos']);

        $this->photoAlbumRepository->update($album, $data);

        if ($photos !== null) {
            $album->photos()->delete();
            foreach ($photos as $index => $photoData) {
                $album->photos()->create([
                    'url' => $photoData['url'],
                    'caption' => $photoData['caption'] ?? null,
                    'order' => $photoData['order'] ?? $index,
                ]);
            }
        }

        $album->load('photos');

        return (new PhotoAlbumResource($album))->response();
    }
}
