<?php

namespace App\Rules;

use App\Models\Media;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class OwnedPmbImageMedia implements ValidationRule
{
    public function __construct(private readonly ?int $userId) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_numeric($value) || (int) $value <= 0) {
            $fail('Foto tidak valid.');

            return;
        }

        if ($this->userId === null) {
            $fail('Foto tidak valid.');

            return;
        }

        $exists = Media::query()
            ->whereKey((int) $value)
            ->where('user_id', $this->userId)
            ->where('collection', 'pmb')
            ->where('mime_type', 'like', 'image/%')
            ->exists();

        if (! $exists) {
            $fail('Foto tidak valid atau bukan milik Anda.');
        }
    }
}
