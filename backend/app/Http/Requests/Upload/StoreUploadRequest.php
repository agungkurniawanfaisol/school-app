<?php

namespace App\Http\Requests\Upload;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Rule;

class StoreUploadRequest extends AdminFormRequest
{
    public function rules(): array
    {
        $isPmb = $this->input('collection') === 'pmb';

        return [
            'file' => [
                'required',
                'file',
                'max:51200',
                $isPmb
                    ? 'mimes:jpg,jpeg,png,webp,pdf'
                    : 'mimes:jpg,jpeg,png,webp,mp4,webm',
            ],
            'collection' => ['required', 'string', 'in:news,activities,facilities,teachers,general,virtual-tour,pmb'],
        ];
    }

    public function messages(): array
    {
        return array_merge($this->commonMessages(), [
            'file.mimes' => 'Format file tidak didukung.',
            'file.max' => 'Ukuran file maksimal 50 MB.',
        ]);
    }
}
