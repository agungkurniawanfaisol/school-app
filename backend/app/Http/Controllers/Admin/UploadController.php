<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Upload\StoreUploadRequest;
use App\Http\Resources\V1\MediaResource;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(StoreUploadRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $collection = $request->validated('collection');
        $originalName = Str::limit(
            preg_replace('/[\x00-\x1F\x7F]/', '', (string) $file->getClientOriginalName()) ?? '',
            255,
            '',
        );
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs("uploads/{$collection}", $filename, 'public');

        $media = Media::query()->create([
            'user_id' => $request->user()?->id,
            'filename' => $filename,
            'original_name' => $originalName,
            'path' => $path,
            'disk' => 'public',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'collection' => $collection,
        ]);

        return response()->json([
            'message' => 'File berhasil diunggah.',
            'data' => new MediaResource($media),
        ], 201);
    }
}
