<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class AdminFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
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
            'integer' => ':attribute harus berupa angka bulat.',
            'boolean' => ':attribute harus berupa true atau false.',
            'date' => ':attribute harus berupa tanggal yang valid.',
            'numeric' => ':attribute harus berupa angka.',
            'in' => ':attribute tidak valid.',
            'exists' => ':attribute tidak ditemukan.',
            'image' => ':attribute harus berupa gambar.',
            'file' => ':attribute harus berupa file.',
        ];
    }
}
