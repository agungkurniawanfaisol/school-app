<?php

namespace Tests\Unit;

use App\Services\TranslationService;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class TranslationServiceTest extends TestCase
{
    private TranslationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TranslationService();
    }

    public function test_is_supported_returns_true_for_valid_locales(): void
    {
        $this->assertTrue($this->service->isSupported('en'));
        $this->assertTrue($this->service->isSupported('ar'));
        $this->assertTrue($this->service->isSupported('ja'));
    }

    public function test_is_supported_returns_false_for_unsupported_locales(): void
    {
        $this->assertFalse($this->service->isSupported('id'));
        $this->assertFalse($this->service->isSupported('fr'));
        $this->assertFalse($this->service->isSupported(''));
    }

    public function test_translate_returns_original_for_unsupported_locale(): void
    {
        $text = 'Selamat Datang';
        $this->assertSame($text, $this->service->translate($text, 'id'));
        $this->assertSame($text, $this->service->translate($text, 'fr'));
    }

    public function test_translate_returns_original_for_empty_text(): void
    {
        $this->assertSame('', $this->service->translate('', 'en'));
        $this->assertSame('   ', $this->service->translate('   ', 'en'));
    }

    public function test_translate_uses_cache(): void
    {
        $text = 'Halo';
        $cacheKey = 'trans:en:' . md5($text);

        Cache::shouldReceive('get')
            ->once()
            ->with($cacheKey)
            ->andReturn('Hello');

        $result = $this->service->translate($text, 'en');
        $this->assertSame('Hello', $result);
    }

    public function test_translate_batch_returns_map(): void
    {
        $texts = ['Halo', 'Dunia'];

        Cache::shouldReceive('get')
            ->with('trans:en:' . md5('Halo'))
            ->andReturn('Hello');
        Cache::shouldReceive('get')
            ->with('trans:en:' . md5('Dunia'))
            ->andReturn('World');

        $result = $this->service->translateBatch($texts, 'en');

        $this->assertSame('Hello', $result['Halo']);
        $this->assertSame('World', $result['Dunia']);
    }

    public function test_translate_batch_returns_original_for_unsupported(): void
    {
        $texts = ['Halo', 'Dunia'];
        $result = $this->service->translateBatch($texts, 'fr');

        $this->assertSame('Halo', $result['Halo']);
        $this->assertSame('Dunia', $result['Dunia']);
    }
}
