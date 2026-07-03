<?php

namespace App\Http\Requests\Teacher;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends AdminFormRequest
{
    public function rules(): array
    {
        /** @var \App\Models\Teacher|null $teacher */
        $teacher = $this->route('teacher');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'name' => ['sometimes', 'string', 'max:200'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('teachers', 'slug')->ignore($teacher?->id)],
            'title' => ['nullable', 'string', 'max:150'],
            'subject' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'content' => ['nullable', 'string'],
            'content_json' => ['nullable', 'array'],
            'photo' => ['nullable', 'string', 'max:500'],
            'email' => ['nullable', 'email', 'max:150'],
            'social_media' => ['nullable', 'array'],
            'social_media.facebook' => ['nullable', 'string', 'max:500'],
            'social_media.instagram' => ['nullable', 'string', 'max:500'],
            'social_media.youtube' => ['nullable', 'string', 'max:500'],
            'social_media.tiktok' => ['nullable', 'string', 'max:500'],
            'social_media.twitter' => ['nullable', 'string', 'max:500'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
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
