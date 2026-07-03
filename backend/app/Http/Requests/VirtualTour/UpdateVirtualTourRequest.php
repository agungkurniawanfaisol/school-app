<?php

namespace App\Http\Requests\VirtualTour;

use Illuminate\Validation\Rule;

class UpdateVirtualTourRequest extends StoreVirtualTourRequest
{
    public function rules(): array
    {
        $tour = $this->route('virtual_tour');
        $tourId = is_object($tour) ? $tour->id : null;

        return array_merge($this->tourRules(), [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'slug' => [
                'sometimes',
                'string',
                'max:270',
                Rule::unique('virtual_tours', 'slug')->ignore($tourId),
            ],
        ]);
    }
}
