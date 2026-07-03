<?php

namespace App\Http\Requests\Media;

use App\Http\Requests\AdminFormRequest;

class StoreMediaRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'filename' => ['required', 'string', 'max:250'],
            'original_name' => ['required', 'string', 'max:250'],
            'path' => ['required', 'string', 'max:500'],
            'disk' => ['sometimes', 'string', 'max:20'],
            'mime_type' => ['nullable', 'string', 'max:100'],
            'size' => ['sometimes', 'integer', 'min:0'],
            'collection' => ['nullable', 'string', 'max:50'],
            'meta' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
