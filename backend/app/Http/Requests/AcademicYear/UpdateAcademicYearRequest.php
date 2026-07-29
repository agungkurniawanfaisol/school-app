<?php

namespace App\Http\Requests\AcademicYear;

class UpdateAcademicYearRequest extends AcademicYearRequest
{
    public function rules(): array
    {
        $rules = $this->sharedRules();
        $rules['school_id'] = ['sometimes', 'required', 'exists:schools,id'];

        return $rules;
    }
}
