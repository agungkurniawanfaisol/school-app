<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhotoAlbumResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'event_date' => $this->event_date?->format('Y-m-d'),
            'is_active' => $this->is_active,
            'order' => $this->order,
            'photos' => $this->whenLoaded('photos', fn () => $this->photos->map(fn ($photo) => [
                'id' => $photo->id,
                'url' => $photo->url,
                'caption' => $photo->caption,
                'order' => $photo->order,
            ])),
            'photos_count' => $this->photos_count ?? ($this->relationLoaded('photos') ? $this->photos->count() : 0),
        ];
    }
}
