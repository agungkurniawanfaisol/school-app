<?php

namespace App\Http\Requests\Curriculum;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;
use Illuminate\Validation\Rule;

class UpdateCurriculumRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('curriculums', 'slug')->ignore($id)],
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
