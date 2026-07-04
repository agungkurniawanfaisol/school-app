<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExtracurricularResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'name' => $this->name,
            'description' => $this->description,
            'category' => $this->category,
            'schedule' => $this->schedule,
            'instructor' => $this->instructor,
            'image' => $this->image,
            'is_active' => $this->is_active,
            'order' => $this->order,
        ];
    }
}
