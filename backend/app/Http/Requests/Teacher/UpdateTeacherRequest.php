<?php

namespace App\Http\Requests\Teacher;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends AdminFormRequest
{
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'name' => ['sometimes', 'string', 'max:200'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('teachers', 'slug')->ignore($id)],
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
