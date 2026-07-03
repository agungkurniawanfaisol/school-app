<?php

namespace App\Http\Requests\Upload;

use App\Http\Requests\AdminFormRequest;

class StoreUploadRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,mp4,webm', 'max:51200'],
            'collection' => ['required', 'string', 'in:news,activities,facilities,teachers,general,virtual-tour'],
        ];
    }

    public function messages(): array
    {
        return array_merge($this->commonMessages(), [
            'file.mimes' => 'Format file harus gambar (jpg, png, webp) atau video (mp4, webm).',
            'file.max' => 'Ukuran file maksimal 50 MB.',
        ]);
    }
}
