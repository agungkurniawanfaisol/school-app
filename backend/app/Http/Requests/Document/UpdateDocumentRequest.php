<?php

namespace App\Http\Requests\Document;

use App\Http\Requests\RichContentAdminRequest;

class UpdateDocumentRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'category' => ['sometimes', 'string', 'in:brosur,formulir,peraturan,kalender,lainnya'],
            'file_url' => ['sometimes', 'string', 'max:500'],
            'file_size' => ['nullable', 'integer', 'min:0'],
            'file_type' => ['nullable', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
