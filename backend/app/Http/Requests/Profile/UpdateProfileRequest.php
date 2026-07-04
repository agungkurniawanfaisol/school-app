<?php

namespace App\Http\Requests\Profile;

use App\Http\Requests\PanelFormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends PanelFormRequest
{
    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'user.name' => ['sometimes', 'string', 'max:200'],
            'user.email' => ['sometimes', 'email', 'max:150', Rule::unique('users', 'email')->ignore($userId)],
            'user.password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'teacher.name' => ['sometimes', 'string', 'max:200'],
            'teacher.title' => ['nullable', 'string', 'max:150'],
            'teacher.subject' => ['nullable', 'string', 'max:150'],
            'teacher.bio' => ['nullable', 'string'],
            'teacher.photo' => ['nullable', 'string', 'max:500'],
            'teacher.email' => ['nullable', 'email', 'max:150'],
            'teacher.social_media' => ['nullable', 'array'],
            'teacher.social_media.facebook' => ['nullable', 'string', 'max:500'],
            'teacher.social_media.instagram' => ['nullable', 'string', 'max:500'],
            'teacher.social_media.youtube' => ['nullable', 'string', 'max:500'],
            'teacher.social_media.tiktok' => ['nullable', 'string', 'max:500'],
            'teacher.social_media.twitter' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
