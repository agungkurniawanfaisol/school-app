<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseProgressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course_enrollment_id' => $this->course_enrollment_id,
            'course_lesson_id' => $this->course_lesson_id,
            'is_completed' => $this->is_completed,
            'progress_percent' => $this->progress_percent,
            'completed_at' => $this->completed_at?->toIso8601String(),
        ];
    }
}
