<?php

namespace App\Http\Requests\PmbRegistration;

use Illuminate\Foundation\Http\FormRequest;

class PublicStorePmbRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'student_name' => ['required', 'string', 'max:200'],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:L,P'],
            'parent_name' => ['required', 'string', 'max:200'],
            'parent_phone' => ['required', 'string', 'max:30'],
            'parent_email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string'],
            'previous_school' => ['nullable', 'string', 'max:250'],
            'grade_applied' => ['required', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'school_id.required' => 'Sekolah wajib dipilih.',
            'student_name.required' => 'Nama siswa wajib diisi.',
            'parent_name.required' => 'Nama orang tua wajib diisi.',
            'parent_phone.required' => 'Nomor telepon orang tua wajib diisi.',
            'grade_applied.required' => 'Jenjang pendaftaran wajib diisi.',
        ];
    }
}
