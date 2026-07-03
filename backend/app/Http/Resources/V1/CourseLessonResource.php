<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseLessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course_module_id' => $this->course_module_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,
            'content' => $this->when($request->routeIs('*.show') || $this->is_free_preview, $this->content),
            'video_url' => $this->when($request->routeIs('*.show') || $this->is_free_preview, $this->video_url),
            'duration_minutes' => $this->duration_minutes,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_free_preview' => $this->is_free_preview,
        ];
    }
}
