<?php

namespace App\Http\Requests\Setting;

use App\Http\Requests\AdminFormRequest;
use App\Models\Setting;
use App\Support\HeroCollage;
use Illuminate\Validation\Validator;

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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $key = $this->input('key');
            if (! is_string($key) || $key === '') {
                $routeId = $this->route('setting') ?? $this->route('id');
                if (is_numeric($routeId)) {
                    $key = Setting::query()->whereKey((int) $routeId)->value('key');
                }
            }

            if (! HeroCollage::isHeroCollageKey(is_string($key) ? $key : null)) {
                return;
            }

            foreach (HeroCollage::validateValue($this->input('value')) as $message) {
                $validator->errors()->add('value', $message);
            }
        });
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
