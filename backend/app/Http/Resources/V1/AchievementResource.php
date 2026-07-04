<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AchievementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'level' => $this->level,
            'student_name' => $this->student_name,
            'year' => $this->year,
            'image' => $this->image,
            'is_active' => $this->is_active,
            'order' => $this->order,
        ];
    }
}
