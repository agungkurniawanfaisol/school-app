<?php

namespace App\Http\Requests\PmbRegistration;

use Illuminate\Foundation\Http\FormRequest;

class PortalMarkNotificationsReadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'all' => ['sometimes', 'boolean'],
            'message_ids' => ['sometimes', 'array'],
            'message_ids.*' => ['integer', 'min:1'],
        ];
    }
}
