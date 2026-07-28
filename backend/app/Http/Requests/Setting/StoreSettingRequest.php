<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\AdminFormRequest;
use App\Support\SettingValueValidator;
use Illuminate\Validation\Validator;

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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $key = $this->input('key');
            foreach (SettingValueValidator::errors(is_string($key) ? $key : null, $this->input('value')) as $message) {
                $validator->errors()->add('value', $message);
            }
        });
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
