<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user' => [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'role' => $this->role,
                'teacher_id' => $this->teacher_id,
            ],
            'teacher' => $this->whenLoaded('teacher', function () {
                if (! $this->teacher) {
                    return null;
                }

                return [
                    'id' => $this->teacher->id,
                    'school_id' => $this->teacher->school_id,
                    'name' => $this->teacher->name,
                    'slug' => $this->teacher->slug,
                    'title' => $this->teacher->title,
                    'subject' => $this->teacher->subject,
                    'bio' => $this->teacher->bio,
                    'photo' => $this->teacher->photo,
                    'email' => $this->teacher->email,
                    'social_media' => $this->teacher->social_media,
                    'order' => $this->teacher->order,
                    'is_active' => $this->teacher->is_active,
                    'is_featured' => $this->teacher->is_featured,
                ];
            }),
        ];
    }
}
