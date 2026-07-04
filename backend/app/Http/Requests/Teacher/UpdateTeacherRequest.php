<?php

namespace App\Http\Requests\Teacher;

use App\Http\Requests\RichContentAdminRequest;
use App\Models\Teacher;
use App\Rules\SafeMediaUrl;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        /** @var \App\Models\Teacher|null $teacher */
        $teacher = $this->route('teacher');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'type' => ['sometimes', 'string', Rule::in(Teacher::TYPES)],
            'name' => ['sometimes', 'string', 'max:200'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('teachers', 'slug')->ignore($teacher?->id)],
            'title' => ['nullable', 'string', 'max:150'],
            'subject' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'content' => ['nullable', 'string'],
            'content_json' => ['nullable', 'array'],
            'photo' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'email' => ['nullable', 'email', 'max:150'],
            'social_media' => ['nullable', 'array'],
            'social_media.facebook' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'social_media.instagram' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'social_media.youtube' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'social_media.tiktok' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'social_media.twitter' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
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
