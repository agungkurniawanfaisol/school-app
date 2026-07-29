<?php

namespace App\Http\Requests\SchoolStat;

use App\Http\Requests\AdminFormRequest;

class StoreSchoolStatRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'icon' => ['nullable', 'string', 'max:100'],
            'label' => ['required', 'string', 'max:100'],
            'value' => ['required', 'string', 'max:50'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return array_merge($this->commonMessages(), [
            'label.required' => 'Label wajib diisi.',
            'value.required' => 'Nilai wajib diisi.',
        ]);
    }
}
