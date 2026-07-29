<?php

namespace App\Support;

final class Rupiah
{
    public static function format(int $amount): string
    {
        return 'Rp '.number_format($amount, 0, ',', '.');
    }

    public static function parse(?string $value): ?int
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        $digits = preg_replace('/[^\d]/', '', $value);
        if ($digits === null || $digits === '') {
            return null;
        }

        return (int) $digits;
    }
}
