<?php

namespace App\Http\Requests\PmbProgram;

class UpdatePmbProgramRequest extends PmbProgramRequest
{
    public function rules(): array
    {
        return $this->sharedRules(true);
    }
}
