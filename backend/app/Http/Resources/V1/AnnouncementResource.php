<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'priority' => $this->priority,
            'is_pinned' => $this->is_pinned,
            'published_at' => $this->published_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'is_active' => $this->is_active,
            'order' => $this->order,
            'cta_text' => $this->cta_text,
            'cta_url' => $this->cta_url,
        ];
    }
}
