<?php

namespace App\Http\Requests\Faq;

use App\Http\Requests\RichContentAdminRequest;

class StoreFaqRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
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
