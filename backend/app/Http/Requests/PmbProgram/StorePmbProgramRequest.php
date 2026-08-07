<?php

namespace App\Http\Requests\PmbProgram;

class StorePmbProgramRequest extends PmbProgramRequest
{
    public function rules(): array
    {
        return $this->sharedRules(false);
    }
}
