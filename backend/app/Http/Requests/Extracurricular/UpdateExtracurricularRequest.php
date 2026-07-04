<?php

namespace App\Http\Requests\Extracurricular;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class UpdateExtracurricularRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'name' => ['sometimes', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'category' => ['sometimes', 'string', 'in:olahraga,seni,akademik,keagamaan,lainnya'],
            'schedule' => ['nullable', 'string', 'max:200'],
            'instructor' => ['nullable', 'string', 'max:200'],
            'image' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
