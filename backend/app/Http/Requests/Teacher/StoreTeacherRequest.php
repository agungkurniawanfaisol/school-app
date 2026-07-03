<?php

namespace App\Http\Requests\Teacher;

use App\Http\Requests\AdminFormRequest;

class StoreTeacherRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:270', 'unique:teachers,slug'],
            'title' => ['nullable', 'string', 'max:150'],
            'subject' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string'],
            'photo' => ['nullable', 'string', 'max:500'],
            'email' => ['nullable', 'email', 'max:150'],
            'social_media' => ['nullable', 'array'],
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
