<?php

namespace Tests\Unit;

use App\Support\Rupiah;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class RupiahTest extends TestCase
{
    #[DataProvider('formatProvider')]
    public function test_formats_amount(int $amount, string $expected): void
    {
        $this->assertSame($expected, Rupiah::format($amount));
    }

    public static function formatProvider(): array
    {
        return [
            [350000, 'Rp 350.000'],
            [1000, 'Rp 1.000'],
            [0, 'Rp 0'],
        ];
    }

    public function test_parses_formatted_and_raw_values(): void
    {
        $this->assertSame(350000, Rupiah::parse('Rp 350.000'));
        $this->assertSame(350000, Rupiah::parse('350000'));
        $this->assertNull(Rupiah::parse(null));
        $this->assertNull(Rupiah::parse('abc'));
    }
}
