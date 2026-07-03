<?php

namespace App\Http\Requests\StudentActivity;

use App\Http\Requests\AdminFormRequest;

class StoreStudentActivityRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'title' => ['required', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', 'unique:student_activities,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string', 'required_without:content_json'],
            'content_json' => ['nullable', 'array', 'required_without:content'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'activity_date' => ['nullable', 'date'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('content_json') && is_string($this->content_json)) {
            $this->merge([
                'content_json' => json_decode($this->content_json, true),
            ]);
        }
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
