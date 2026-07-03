<?php

namespace App\Http\Requests\Curriculum;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class StoreCurriculumRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'title' => ['required', 'string', 'max:250'],
            'slug' => ['required', 'string', 'max:270', 'unique:curriculums,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'content_json' => ['nullable', 'array'],
            'icon' => ['nullable', 'string', 'max:100'],
            'thumbnail' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'category' => ['nullable', 'string', 'max:100'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
