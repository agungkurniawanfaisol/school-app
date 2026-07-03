<?php

namespace App\Http\Requests\Testimonial;

use App\Http\Requests\AdminFormRequest;

class UpdateTestimonialRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'name' => ['sometimes', 'string', 'max:200'],
            'role' => ['nullable', 'string', 'max:150'],
            'content' => ['sometimes', 'string'],
            'photo' => ['nullable', 'string', 'max:500'],
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
