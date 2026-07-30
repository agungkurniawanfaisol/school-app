<?php

namespace App\Http\Requests\PmbEmail;

use App\Models\PmbRegistration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BroadcastPmbEmailRequest extends FormRequest
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
            'subject' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string', 'max:10000'],
            'status' => ['nullable', 'string', Rule::in(array_merge(['all'], PmbRegistration::STATUSES))],
        ];
    }
}
