<?php

namespace App\Rules;

use App\Support\SafeUrl;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeMediaUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_string($value)) {
            $fail('URL media tidak valid.');

            return;
        }

        if (! SafeUrl::isAllowed($value)) {
            $fail('URL media tidak valid atau tidak diizinkan.');
        }
    }
}
