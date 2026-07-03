<?php

namespace App\Http\Requests\Facility;

use App\Http\Requests\AdminFormRequest;

class StoreFacilityRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:250'],
            'slug' => ['required', 'string', 'max:270', 'unique:facilities,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
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
