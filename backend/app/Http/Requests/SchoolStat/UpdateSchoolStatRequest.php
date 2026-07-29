<?php

namespace App\Http\Requests\SchoolStat;

use App\Http\Requests\AdminFormRequest;

class UpdateSchoolStatRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'icon' => ['nullable', 'string', 'max:100'],
            'label' => ['sometimes', 'string', 'max:100'],
            'value' => ['sometimes', 'string', 'max:50'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
