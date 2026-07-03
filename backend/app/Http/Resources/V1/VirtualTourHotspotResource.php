<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VirtualTourHotspotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'label' => $this->label,
            'pitch' => (float) $this->pitch,
            'yaw' => (float) $this->yaw,
            'order' => $this->order,
            'target_scene_uuid' => $this->whenLoaded('targetScene', fn () => $this->targetScene?->uuid),
            'target_scene_title' => $this->whenLoaded('targetScene', fn () => $this->targetScene?->title),
        ];
    }
}
