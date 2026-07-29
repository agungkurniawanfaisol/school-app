<?php

namespace Tests\Unit;

use App\Support\GoogleMapsEmbed;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class GoogleMapsEmbedTest extends TestCase
{
    public function test_normalize_extracts_src_from_iframe_html(): void
    {
        $iframe = '<iframe src="https://www.google.com/maps/embed?pb=abc123" width="600" height="450"></iframe>';

        $this->assertSame(
            'https://www.google.com/maps/embed?pb=abc123',
            GoogleMapsEmbed::normalize($iframe),
        );
    }

    public function test_normalize_trims_plain_url(): void
    {
        $this->assertSame(
            'https://www.google.com/maps/embed?pb=xyz',
            GoogleMapsEmbed::normalize("  https://www.google.com/maps/embed?pb=xyz  "),
        );
    }

    #[DataProvider('validEmbedUrls')]
    public function test_accepts_valid_embed_urls(string $url): void
    {
        $this->assertTrue(GoogleMapsEmbed::isValidEmbedUrl($url));
    }

    #[DataProvider('invalidEmbedUrls')]
    public function test_rejects_invalid_embed_urls(string $url): void
    {
        $this->assertFalse(GoogleMapsEmbed::isValidEmbedUrl($url));
    }

    public static function validEmbedUrls(): array
    {
        return [
            'google embed' => ['https://www.google.com/maps/embed?pb=!1m18'],
            'maps.google output embed' => ['https://maps.google.com/maps?q=-6.26,106.78&output=embed'],
            'google.co.id embed' => ['https://www.google.co.id/maps/embed?pb=abc'],
        ];
    }

    public static function invalidEmbedUrls(): array
    {
        return [
            'share short link' => ['https://maps.app.goo.gl/Abc123'],
            'place page' => ['https://www.google.com/maps/place/Jakarta'],
            'http' => ['http://www.google.com/maps/embed?pb=abc'],
            'non google' => ['https://example.com/maps/embed?pb=abc'],
        ];
    }
}
