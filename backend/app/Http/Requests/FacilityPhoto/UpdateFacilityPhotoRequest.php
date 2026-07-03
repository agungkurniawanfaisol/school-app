<?php

namespace App\Http\Requests\FacilityPhoto;

use App\Http\Requests\AdminFormRequest;

class UpdateFacilityPhotoRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'facility_id' => ['sometimes', 'exists:facilities,id'],
            'path' => ['sometimes', 'string', 'max:500'],
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
