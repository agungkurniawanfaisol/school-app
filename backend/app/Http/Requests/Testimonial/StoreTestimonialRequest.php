<?php

namespace App\Http\Requests\Testimonial;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class StoreTestimonialRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:200'],
            'role' => ['nullable', 'string', 'max:150'],
            'content' => ['required', 'string'],
            'photo' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
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
