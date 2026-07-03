<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'name' => $this->name,
            'role' => $this->role,
            'content' => $this->content,
            'photo' => $this->photo,
            'rating' => $this->rating,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
        ];
    }
}
