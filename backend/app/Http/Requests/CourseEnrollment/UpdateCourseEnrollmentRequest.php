<?php

namespace App\Http\Requests\CourseEnrollment;

use App\Http\Requests\AdminFormRequest;

class UpdateCourseEnrollmentRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'course_id' => ['sometimes', 'exists:courses,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'student_name' => ['sometimes', 'string', 'max:200'],
            'student_email' => ['sometimes', 'email', 'max:150'],
            'status' => ['sometimes', 'string', 'in:active,completed,cancelled'],
            'enrolled_at' => ['nullable', 'date'],
            'completed_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
