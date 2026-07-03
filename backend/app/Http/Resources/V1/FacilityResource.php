<?php

namespace App\Http\Resources\V1;

use App\Http\Resources\Concerns\ExposesRichContent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacilityResource extends JsonResource
{
    use ExposesRichContent;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'content' => $this->when($this->exposesFullContent($request), $this->content),
            'content_json' => $this->when(
                $this->isAdminRequest($request) || $this->exposesFullContent($request),
                $this->content_json,
            ),
            'thumbnail' => $this->thumbnail,
            'category' => $this->category,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'photos' => FacilityPhotoResource::collection($this->whenLoaded('photos')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
