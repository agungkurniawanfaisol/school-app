<?php

namespace App\Http\Requests\AppRelease;

class StoreAppReleaseRequest extends AppReleaseRequest
{
    public function rules(): array
    {
        return $this->sharedRules(false);
    }
}
