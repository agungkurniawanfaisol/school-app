<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Stichoza\GoogleTranslate\GoogleTranslate;

class TranslationService
{
    private const CACHE_TTL = 86400; // 24 hours

    private const SUPPORTED_LOCALES = ['en', 'ar', 'ja'];

    private const SEPARATOR = "\n###\n";

    private ?GoogleTranslate $translator = null;

    private string $currentLocale = '';

    public function isSupported(string $locale): bool
    {
        return in_array($locale, self::SUPPORTED_LOCALES, true);
    }

    public function translate(string $text, string $targetLocale): string
    {
        if (! $this->isSupported($targetLocale) || trim($text) === '') {
            return $text;
        }

        $cacheKey = 'trans:' . $targetLocale . ':' . md5($text);

        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $result = $this->getTranslator($targetLocale)->translate($text);
            if ($result !== null && $result !== $text) {
                Cache::put($cacheKey, $result, self::CACHE_TTL);
                return $result;
            }

            return $text;
        } catch (\Throwable $e) {
            Log::warning('Translation failed', [
                'locale' => $targetLocale,
                'text_length' => mb_strlen($text),
                'error' => $e->getMessage(),
            ]);

            return $text;
        }
    }

    /**
     * Translate multiple unique strings efficiently by combining them into
     * a single Google Translate call using a separator, then splitting.
     *
     * @param  string[]  $texts  Unique texts to translate
     * @return array<string, string>  Map of original text → translated text
     */
    public function translateBatch(array $texts, string $targetLocale): array
    {
        if (! $this->isSupported($targetLocale) || empty($texts)) {
            return array_combine($texts, $texts) ?: [];
        }

        $results = [];
        $uncached = [];
        $uncachedKeys = [];

        foreach ($texts as $text) {
            if (trim($text) === '') {
                $results[$text] = $text;
                continue;
            }

            $cacheKey = 'trans:' . $targetLocale . ':' . md5($text);
            $cached = Cache::get($cacheKey);

            if ($cached !== null) {
                $results[$text] = $cached;
            } else {
                $uncached[] = $text;
                $uncachedKeys[] = $cacheKey;
            }
        }

        if (empty($uncached)) {
            return $results;
        }

        $translated = $this->doBatchTranslate($uncached, $targetLocale);

        foreach ($uncached as $i => $text) {
            $result = $translated[$i] ?? $text;
            $results[$text] = $result;

            if ($result !== $text) {
                Cache::put($uncachedKeys[$i], $result, self::CACHE_TTL);
            }
        }

        return $results;
    }

    /**
     * Combine texts with a unique separator, translate as one string,
     * then split back. Falls back to individual translation on failure.
     */
    private function doBatchTranslate(array $texts, string $targetLocale): array
    {
        $combined = implode(self::SEPARATOR, $texts);

        try {
            $translated = $this->getTranslator($targetLocale)->translate($combined);

            if ($translated === null) {
                return $texts;
            }

            $parts = preg_split('/\s*###\s*/', $translated);

            if (count($parts) === count($texts)) {
                return array_map('trim', $parts);
            }

            Log::info('Batch split mismatch, falling back to individual', [
                'expected' => count($texts),
                'got' => count($parts),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Batch translation failed, falling back to individual', [
                'locale' => $targetLocale,
                'count' => count($texts),
                'error' => $e->getMessage(),
            ]);
        }

        return $this->translateIndividually($texts, $targetLocale);
    }

    private function translateIndividually(array $texts, string $targetLocale): array
    {
        $results = [];
        foreach ($texts as $text) {
            try {
                $result = $this->getTranslator($targetLocale)->translate($text);
                $results[] = $result ?? $text;
                usleep(50_000);
            } catch (\Throwable) {
                $results[] = $text;
            }
        }

        return $results;
    }

    private function getTranslator(string $targetLocale): GoogleTranslate
    {
        if (! $this->translator || $this->currentLocale !== $targetLocale) {
            $this->translator = new GoogleTranslate($targetLocale, 'id');
            $this->currentLocale = $targetLocale;
        }

        return $this->translator;
    }
}
