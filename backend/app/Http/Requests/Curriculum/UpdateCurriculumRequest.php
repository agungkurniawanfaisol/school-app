<?php

namespace App\Http\Requests\Curriculum;

use App\Http\Requests\RichContentAdminRequest;
use App\Models\Curriculum;
use App\Rules\SafeMediaUrl;
use Illuminate\Validation\Rule;

class UpdateCurriculumRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        $curriculumId = $this->route('curriculum') ?? $this->route('id');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique(Curriculum::class, 'slug')->ignore($curriculumId)],
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
