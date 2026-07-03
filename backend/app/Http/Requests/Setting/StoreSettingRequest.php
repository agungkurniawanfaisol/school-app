<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\AdminFormRequest;

class StoreSettingRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['nullable', 'exists:schools,id'],
            'group' => ['required', 'string', 'max:50'],
            'key' => ['required', 'string', 'max:100'],
            'value' => ['nullable', 'string'],
            'type' => ['sometimes', 'string', 'in:string,integer,boolean,json'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
