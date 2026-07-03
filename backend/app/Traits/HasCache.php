<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait HasCache
{
    protected int $cacheTtl = 3600;

    abstract protected function cacheTag(): string;

    protected function cacheVersionKey(): string
    {
        return $this->cacheTag() . ':cache_version';
    }

    protected function getCacheVersion(): string
    {
        return (string) Cache::get($this->cacheVersionKey(), '1');
    }

    protected function cacheKey(string $method, array $params = []): string
    {
        ksort($params);

        return sprintf(
            '%s:v%s:%s:%s',
            $this->cacheTag(),
            $this->getCacheVersion(),
            $method,
            md5(json_encode($params)),
        );
    }

    protected function remember(string $key, callable $callback, ?int $ttl = null): mixed
    {
        return Cache::remember($key, $ttl ?? $this->cacheTtl, $callback);
    }

    protected function clearCache(): void
    {
        Cache::forever($this->cacheVersionKey(), (string) time());
    }

    protected function clearCacheForTags(array $tags): void
    {
        foreach ($tags as $tag) {
            Cache::forever($tag . ':cache_version', (string) time());
        }
    }
}
