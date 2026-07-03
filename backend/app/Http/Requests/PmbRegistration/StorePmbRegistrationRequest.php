<?php

namespace App\Http\Requests\PmbRegistration;

use App\Http\Requests\AdminFormRequest;

class StorePmbRegistrationRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'registration_number' => ['required', 'string', 'max:50', 'unique:pmb_registrations,registration_number'],
            'student_name' => ['required', 'string', 'max:200'],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:L,P'],
            'parent_name' => ['nullable', 'string', 'max:200'],
            'parent_phone' => ['nullable', 'string', 'max:30'],
            'parent_email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string'],
            'previous_school' => ['nullable', 'string', 'max:250'],
            'grade_applied' => ['nullable', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'in:pending,review,accepted,rejected'],
            'notes' => ['nullable', 'string'],
            'payment_info' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
