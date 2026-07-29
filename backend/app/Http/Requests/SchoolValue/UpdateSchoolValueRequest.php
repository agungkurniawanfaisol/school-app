<?php

namespace App\Http\Requests\SchoolValue;

use App\Http\Requests\AdminFormRequest;

class UpdateSchoolValueRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'icon' => ['nullable', 'string', 'max:100'],
            'title' => ['sometimes', 'string', 'max:100'],
            'description' => ['sometimes', 'string', 'max:500'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
