<?php

namespace App\Http\Requests\PmbFee;

class StorePmbFeeRequest extends PmbFeeRequest
{
    public function rules(): array
    {
        return $this->sharedRules();
    }
}
