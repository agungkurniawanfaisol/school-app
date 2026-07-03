<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HeroSliderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'image' => $this->image,
            'cta_text' => $this->cta_text,
            'cta_url' => $this->cta_url,
            'order' => $this->order,
            'is_active' => $this->is_active,
        ];
    }
}
