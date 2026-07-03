<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\AdminFormRequest;

class UpdateSettingRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['nullable', 'exists:schools,id'],
            'group' => ['sometimes', 'string', 'max:50'],
            'key' => ['sometimes', 'string', 'max:100'],
            'value' => ['nullable', 'string'],
            'type' => ['sometimes', 'string', 'in:string,integer,boolean,json'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
