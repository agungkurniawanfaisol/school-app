<?php

namespace App\Http\Requests\Faq;

use App\Http\Requests\RichContentAdminRequest;

class UpdateFaqRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'question' => ['sometimes', 'string', 'max:500'],
            'answer' => ['sometimes', 'string'],
            'category' => ['sometimes', 'string', 'in:pmb,akademik,biaya,umum'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
