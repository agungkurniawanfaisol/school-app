<?php

namespace App\Http\Requests\AppRelease;

class UpdateAppReleaseRequest extends AppReleaseRequest
{
    public function rules(): array
    {
        return $this->sharedRules(true);
    }
}
