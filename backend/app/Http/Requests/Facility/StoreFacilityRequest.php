<?php

namespace App\Http\Requests\Facility;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class StoreFacilityRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:250'],
            'slug' => ['required', 'string', 'max:270', 'unique:facilities,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'content_json' => ['nullable', 'array'],
            'thumbnail' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'category' => ['nullable', 'string', 'max:100'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'photos' => ['sometimes', 'array'],
            'photos.*.path' => ['required_with:photos', 'string', 'max:500', new SafeMediaUrl],
            'photos.*.caption' => ['nullable', 'string', 'max:250'],
            'photos.*.order' => ['sometimes', 'integer', 'min:0'],
            'photos.*.is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
