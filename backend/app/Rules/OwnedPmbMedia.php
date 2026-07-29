<?php

namespace App\Rules;

use App\Models\Media;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class OwnedPmbMedia implements ValidationRule
{
    public function __construct(
        private readonly ?int $userId,
        private readonly bool $imagesOnly = false,
    ) {}

    public static function imageOnly(?int $userId): self
    {
        return new self($userId, imagesOnly: true);
    }

    public static function imageOrPdf(?int $userId): self
    {
        return new self($userId, imagesOnly: false);
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_numeric($value) || (int) $value <= 0) {
            $fail('Berkas tidak valid.');

            return;
        }

        if ($this->userId === null) {
            $fail('Berkas tidak valid.');

            return;
        }

        $query = Media::query()
            ->whereKey((int) $value)
            ->where('user_id', $this->userId)
            ->where('collection', 'pmb');

        if ($this->imagesOnly) {
            $query->where('mime_type', 'like', 'image/%');
        } else {
            $query->where(function ($builder): void {
                $builder->where('mime_type', 'like', 'image/%')
                    ->orWhere('mime_type', 'application/pdf');
            });
        }

        if (! $query->exists()) {
            $fail('Berkas tidak valid atau bukan milik Anda.');
        }
    }
}
