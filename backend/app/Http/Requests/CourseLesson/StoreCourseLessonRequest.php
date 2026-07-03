<?php

namespace App\Http\Requests\CourseLesson;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class StoreCourseLessonRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'course_module_id' => ['required', 'exists:course_modules,id'],
            'title' => ['required', 'string', 'max:250'],
            'slug' => ['required', 'string', 'max:270'],
            'type' => ['sometimes', 'string', 'in:text,video,quiz,file'],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
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
