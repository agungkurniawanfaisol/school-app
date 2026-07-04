<?php

namespace App\Http\Requests\School;

use App\Http\Requests\AdminFormRequest;

class StoreSchoolRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:250'],
            'slug' => ['required', 'string', 'max:270', 'unique:schools,slug'],
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
        return array_merge($this->commonMessages(), [
            'name.required' => 'Nama sekolah wajib diisi.',
            'slug.required' => 'Slug wajib diisi.',
            'slug.unique' => 'Slug sudah digunakan.',
        ]);
    }
}
