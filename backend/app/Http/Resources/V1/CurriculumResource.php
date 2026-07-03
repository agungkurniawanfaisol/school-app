<?php

namespace App\Http\Resources\V1;

use App\Http\Resources\Concerns\ExposesRichContent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurriculumResource extends JsonResource
{
    use ExposesRichContent;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($this->exposesFullContent($request), $this->content),
            'content_json' => $this->when(
                $this->isAdminRequest($request) || $this->exposesFullContent($request),
                $this->content_json,
            ),
            'icon' => $this->icon,
            'thumbnail' => $this->thumbnail,
            'category' => $this->category,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
