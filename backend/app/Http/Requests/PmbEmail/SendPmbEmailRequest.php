<?php

namespace App\Http\Requests\PmbEmail;

use App\Models\PmbRegistration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SendPmbEmailRequest extends FormRequest
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
            'registration_uuids' => ['required', 'array', 'min:1', 'max:50'],
            'registration_uuids.*' => ['required', 'uuid', Rule::exists('pmb_registrations', 'uuid')->whereNull('deleted_at')],
            'subject' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string', 'max:10000'],
        ];
    }
}
