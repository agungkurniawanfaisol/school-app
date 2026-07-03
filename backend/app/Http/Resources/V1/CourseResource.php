<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'description' => $this->when($request->routeIs('*.show'), $this->description),
            'thumbnail' => $this->thumbnail,
            'category' => $this->category,
            'level' => $this->level,
            'duration_minutes' => $this->duration_minutes,
            'price' => $this->price,
            'status' => $this->when($request->routeIs('admin.*'), $this->status),
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at?->toIso8601String(),
            'modules' => CourseModuleResource::collection($this->whenLoaded('modules')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
