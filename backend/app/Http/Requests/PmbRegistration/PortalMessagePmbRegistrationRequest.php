<?php

namespace App\Http\Requests\PmbRegistration;

use App\Rules\OwnedPmbMedia;
use Illuminate\Foundation\Http\FormRequest;

class PortalMessagePmbRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:5000'],
            'media_id' => [
                'nullable',
                'integer',
                OwnedPmbMedia::imageOrPdf($this->user()?->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'body.required' => 'Pesan wajib diisi.',
        ];
    }
}
