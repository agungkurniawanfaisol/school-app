<?php

namespace App\Http\Middleware;

use App\Services\TranslationService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TranslateResponse
{
    private const SKIP_KEYS = [
        'id', 'uuid', 'school_id', 'slug', 'email', 'photo', 'url',
        'type', 'status', 'category', 'created_at', 'updated_at',
        'deleted_at', 'published_at', 'order', 'is_active', 'is_featured',
        'has_linked_user', 'latitude', 'longitude', 'phone', 'whatsapp',
        'map_embed_url', 'social_media', 'content_json', 'pannellum_config',
        'image_url', 'registration_number', 'tracking_token', 'content',
        'per_page', 'current_page', 'last_page', 'total', 'from', 'to',
        'first_page_url', 'last_page_url', 'next_page_url', 'prev_page_url',
        'path', 'links',
        'thumbnail', 'logo', 'favicon', 'image', 'postal_code',
    ];

    public function __construct(private TranslationService $translationService) {}

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $response instanceof JsonResponse) {
            return $response;
        }

        $locale = $request->query('lang')
            ?? $request->header('X-Locale')
            ?? 'id';

        if ($locale === 'id' || ! $this->translationService->isSupported($locale)) {
            return $response;
        }

        $data = $response->getData(true);

        $strings = [];
        $this->collectStrings($data, $strings);

        if (empty($strings)) {
            return $response;
        }

        $uniqueTexts = array_unique($strings);
        $translations = $this->translationService->translateBatch($uniqueTexts, $locale);

        $translated = $this->applyTranslations($data, $translations);
        $response->setData($translated);

        return $response;
    }

    private function collectStrings(mixed $data, array &$strings, string $parentKey = ''): void
    {
        if (is_string($data) && trim($data) !== '' && ! $this->shouldSkip($parentKey)) {
            $text = $this->looksLikeHtml($data) ? strip_tags($data) : $data;
            if (trim($text) !== '') {
                $strings[] = $text;
            }
        }

        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $keyStr = is_int($key) ? $parentKey : (string) $key;
                $this->collectStrings($value, $strings, $keyStr);
            }
        }
    }

    private function applyTranslations(mixed $data, array $translations, string $parentKey = ''): mixed
    {
        if (is_string($data) && trim($data) !== '' && ! $this->shouldSkip($parentKey)) {
            $text = $this->looksLikeHtml($data) ? strip_tags($data) : $data;
            return $translations[$text] ?? $data;
        }

        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $keyStr = is_int($key) ? $parentKey : (string) $key;
                $data[$key] = $this->applyTranslations($value, $translations, $keyStr);
            }
        }

        return $data;
    }

    private function shouldSkip(string $key): bool
    {
        if ($key === '') {
            return false;
        }

        return in_array($key, self::SKIP_KEYS, true)
            || str_ends_with($key, '_id')
            || str_ends_with($key, '_at')
            || str_ends_with($key, '_url')
            || str_ends_with($key, '_json')
            || str_ends_with($key, '_path')
            || str_ends_with($key, '_token');
    }

    private function looksLikeHtml(string $text): bool
    {
        return str_contains($text, '<') && str_contains($text, '>');
    }
}
