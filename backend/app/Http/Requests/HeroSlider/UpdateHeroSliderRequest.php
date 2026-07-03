<?php

namespace App\Http\Requests\HeroSlider;

use App\Http\Requests\AdminFormRequest;

class UpdateHeroSliderRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:250'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'image' => ['sometimes', 'string', 'max:500'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_url' => ['nullable', 'string', 'max:500'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
