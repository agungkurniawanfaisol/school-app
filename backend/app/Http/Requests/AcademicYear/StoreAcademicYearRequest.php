<?php

namespace App\Http\Requests\AcademicYear;

class StoreAcademicYearRequest extends AcademicYearRequest
{
    public function rules(): array
    {
        return $this->sharedRules();
    }
}
