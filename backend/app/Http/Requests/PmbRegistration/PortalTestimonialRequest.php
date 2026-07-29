<?php

namespace App\Http\Requests\PmbRegistration;

use App\Rules\OwnedPmbMedia;
use Illuminate\Foundation\Http\FormRequest;

class PortalTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'integer', 'exists:schools,id'],
            'content' => ['required', 'string', 'min:10', 'max:2000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'photo_media_id' => ['nullable', 'integer', OwnedPmbMedia::imageOnly($this->user()?->id)],
            'role' => ['nullable', 'string', 'max:150'],
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'Isi testimoni wajib diisi.',
            'content.min' => 'Testimoni minimal 10 karakter.',
            'content.max' => 'Testimoni maksimal 2000 karakter.',
            'rating.required' => 'Rating wajib dipilih.',
            'rating.min' => 'Rating minimal 1 bintang.',
            'rating.max' => 'Rating maksimal 5 bintang.',
        ];
    }
}
