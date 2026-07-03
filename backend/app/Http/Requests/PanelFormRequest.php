<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class PanelFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isPanelUser() ?? false;
    }

    protected function commonMessages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'string' => ':attribute harus berupa teks.',
            'email' => ':attribute harus berupa email yang valid.',
            'unique' => ':attribute sudah digunakan.',
            'max' => ':attribute tidak boleh lebih dari :max karakter.',
            'min' => ':attribute minimal :min karakter.',
            'boolean' => ':attribute harus berupa true atau false.',
            'in' => ':attribute tidak valid.',
            'exists' => ':attribute tidak ditemukan.',
            'confirmed' => 'Konfirmasi :attribute tidak cocok.',
        ];
    }
}
