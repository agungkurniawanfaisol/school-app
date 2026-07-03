<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'title' => $this->title,
            'subject' => $this->subject,
            'bio' => $this->when($request->routeIs('*.show'), $this->bio),
            'photo' => $this->photo,
            'email' => $this->when($request->routeIs('*.show'), $this->email),
            'social_media' => $this->social_media,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
        ];
    }
}
