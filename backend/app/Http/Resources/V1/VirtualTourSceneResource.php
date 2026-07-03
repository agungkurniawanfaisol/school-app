<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VirtualTourSceneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'image' => $this->image,
            'initial_pitch' => (float) $this->initial_pitch,
            'initial_yaw' => (float) $this->initial_yaw,
            'order' => $this->order,
            'hotspots' => VirtualTourHotspotResource::collection($this->whenLoaded('hotspots')),
        ];
    }
}
