<?php

namespace App\Http\Requests\CourseModule;

use App\Http\Requests\AdminFormRequest;

class UpdateCourseModuleRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'course_id' => ['sometimes', 'exists:courses,id'],
            'title' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270'],
            'description' => ['nullable', 'string'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
