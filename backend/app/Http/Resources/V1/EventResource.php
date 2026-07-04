<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'description' => $this->description,
            'location' => $this->location,
            'event_date' => $this->event_date?->toDateString(),
            'event_end_date' => $this->event_end_date?->toDateString(),
            'event_time' => $this->event_time,
            'category' => $this->category,
            'is_active' => $this->is_active,
            'order' => $this->order,
        ];
    }
}
