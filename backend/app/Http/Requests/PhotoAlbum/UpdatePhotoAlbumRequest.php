<?php

namespace App\Http\Requests\PhotoAlbum;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class UpdatePhotoAlbumRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:250', 'unique:photo_albums,slug,' . $this->route('id')],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'event_date' => ['nullable', 'date'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'photos' => ['array', 'nullable'],
            'photos.*.url' => ['required', 'string', 'max:500'],
            'photos.*.caption' => ['nullable', 'string', 'max:300'],
            'photos.*.order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
