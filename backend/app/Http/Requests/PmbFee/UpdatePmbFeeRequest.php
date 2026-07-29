<?php

namespace App\Http\Requests\PmbFee;

class UpdatePmbFeeRequest extends PmbFeeRequest
{
    public function rules(): array
    {
        return $this->sharedRules();
    }
}
