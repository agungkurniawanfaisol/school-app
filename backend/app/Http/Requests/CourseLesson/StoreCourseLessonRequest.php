<?php

namespace App\Http\Requests\CourseLesson;

use App\Http\Requests\AdminFormRequest;

class StoreCourseLessonRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'course_module_id' => ['required', 'exists:course_modules,id'],
            'title' => ['required', 'string', 'max:250'],
            'slug' => ['required', 'string', 'max:270'],
            'type' => ['sometimes', 'string', 'in:text,video,quiz,file'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'duration_minutes' => ['sometimes', 'integer', 'min:0'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_free_preview' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
