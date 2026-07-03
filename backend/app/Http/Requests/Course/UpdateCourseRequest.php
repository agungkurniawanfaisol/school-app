<?php

namespace App\Http\Requests\Course;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends AdminFormRequest
{
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('courses', 'slug')->ignore($id)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'category' => ['nullable', 'string', 'max:100'],
            'level' => ['nullable', 'string', 'max:50'],
            'duration_minutes' => ['sometimes', 'integer', 'min:0'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
