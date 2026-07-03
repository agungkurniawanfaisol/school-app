<?php

namespace App\Http\Requests\PmbDocument;

use App\Http\Requests\AdminFormRequest;

class UpdatePmbDocumentRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'pmb_registration_id' => ['sometimes', 'exists:pmb_registrations,id'],
            'document_type' => ['sometimes', 'string', 'max:50'],
            'file_path' => ['sometimes', 'string', 'max:500'],
            'original_name' => ['nullable', 'string', 'max:250'],
            'status' => ['sometimes', 'string', 'in:pending,approved,rejected'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
