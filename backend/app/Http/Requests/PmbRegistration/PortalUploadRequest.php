<?php

namespace App\Http\Requests\PmbRegistration;

use Illuminate\Foundation\Http\FormRequest;

class PortalUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $purpose = $this->input('purpose', 'payment_proof');

        $mimes = in_array($purpose, ['student_photo', 'testimonial_photo'], true)
            ? 'mimes:jpg,jpeg,png,webp'
            : 'mimes:jpg,jpeg,png,webp,pdf';

        $maxKilobytes = in_array($purpose, ['student_photo', 'testimonial_photo'], true) ? 1024 : 10240;

        return [
            'file' => ['required', 'file', $mimes, 'max:'.$maxKilobytes],
            'collection' => ['required', 'string', 'in:pmb'],
            'purpose' => ['required', 'string', 'in:student_photo,payment_proof,testimonial_photo'],
        ];
    }

    public function messages(): array
    {
        $purpose = $this->input('purpose', 'payment_proof');

        return [
            'file.mimes' => in_array($purpose, ['student_photo', 'testimonial_photo'], true)
                ? 'Format foto harus JPG, PNG, atau WEBP.'
                : 'Format file harus gambar (jpg, png, webp) atau PDF.',
            'file.max' => in_array($purpose, ['student_photo', 'testimonial_photo'], true)
                ? 'Ukuran foto maksimal 1 MB.'
                : 'Ukuran file maksimal 10 MB.',
        ];
    }
}
