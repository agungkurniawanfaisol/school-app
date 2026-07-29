<?php

namespace App\Http\Requests\PmbRegistration;

use App\Models\PmbRegistration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdatePmbPortalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'string', Rule::in(PmbRegistration::STATUSES)],
            'notes' => ['nullable', 'string'],
            'grade_applied' => ['nullable', 'string', 'max:50'],
            'verify_payment' => ['sometimes', 'boolean'],
            'reject_payment' => ['sometimes', 'boolean'],
            'payment_rejection_reason' => ['nullable', 'string', 'max:500'],
            'issue_loa' => ['sometimes', 'boolean'],
        ];
    }
}
