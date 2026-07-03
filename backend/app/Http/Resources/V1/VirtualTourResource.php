<?php

namespace App\Http\Resources\V1;

use App\Support\VirtualTourPannellumBuilder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VirtualTourResource extends JsonResource
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
            'is_active' => $this->is_active,
            'order' => $this->order,
            'start_scene_uuid' => $this->whenLoaded('startScene', fn () => $this->startScene?->uuid),
            'scenes' => VirtualTourSceneResource::collection($this->whenLoaded('scenes')),
            'pannellum' => $this->when(
                $this->relationLoaded('scenes'),
                fn () => VirtualTourPannellumBuilder::build($this->resource),
            ),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
