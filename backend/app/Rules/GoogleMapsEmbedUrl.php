<?php

namespace App\Rules;

use App\Support\GoogleMapsEmbed;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GoogleMapsEmbedUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_string($value)) {
            $fail('URL embed Google Maps tidak valid.');

            return;
        }

        if (mb_strlen($value) > GoogleMapsEmbed::MAX_LENGTH) {
            $fail('URL embed Google Maps maksimal '.GoogleMapsEmbed::MAX_LENGTH.' karakter.');

            return;
        }

        if (! GoogleMapsEmbed::isValidEmbedUrl($value)) {
            $fail('URL embed Google Maps tidak valid. Salin URL dari Sematkan peta (atribut src), bukan link Bagikan.');
        }
    }
}
