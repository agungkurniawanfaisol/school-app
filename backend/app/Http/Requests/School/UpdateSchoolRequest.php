<?php

namespace App\Http\Requests\School;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolRequest extends AdminFormRequest
{
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('schools', 'slug')->ignore($id)],
            'tagline' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'logo' => ['nullable', 'string', 'max:500'],
            'favicon' => ['nullable', 'string', 'max:500'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric', 'min:-90', 'max:90'],
            'longitude' => ['nullable', 'numeric', 'min:-180', 'max:180'],
            'map_embed_url' => ['nullable', 'url:https', 'max:1000', 'regex:/^https:\/\/(www\.)?google\.(com|co\.\w+)/i'],
            'vision' => ['nullable', 'string', 'max:1000'],
            'mission' => ['nullable', 'string', 'max:2000'],
            'social_media' => ['nullable', 'array'],
            'social_media.facebook' => ['nullable', 'string', 'max:500'],
            'social_media.instagram' => ['nullable', 'string', 'max:500'],
            'social_media.youtube' => ['nullable', 'string', 'max:500'],
            'seo' => ['nullable', 'array'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
