<?php

namespace App\Http\Requests\CourseProgress;

use App\Http\Requests\AdminFormRequest;

class UpdateCourseProgressRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'course_enrollment_id' => ['sometimes', 'exists:course_enrollments,id'],
            'course_lesson_id' => ['sometimes', 'exists:course_lessons,id'],
            'is_completed' => ['sometimes', 'boolean'],
            'progress_percent' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'completed_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
