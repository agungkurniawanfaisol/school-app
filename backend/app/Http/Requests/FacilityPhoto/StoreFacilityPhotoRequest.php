<?php

namespace App\Http\Requests\FacilityPhoto;

use App\Http\Requests\AdminFormRequest;

class StoreFacilityPhotoRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'exists:facilities,id'],
            'path' => ['required', 'string', 'max:500'],
            'caption' => ['nullable', 'string', 'max:250'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
