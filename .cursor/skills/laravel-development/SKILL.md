---
name: laravel-development
description: Laravel 12 backend patterns for Nurul Hikmah — Repository + HasCache, Form Requests, API Resources, PHPUnit tests. Use when implementing backend features, APIs, repositories, or migrations. Complements global laravel-superpowers with this project's conventions.
---

# Laravel Development — Nurul Hikmah

Global reference: `laravel-superpowers` (~/.agents/skills/). **This project uses Repository pattern**, not Service layer.

## Stack

- Laravel 12, PHP 8.4, Sanctum, MySQL
- File cache via `HasCache` — NO Redis
- PHPUnit (`php artisan test`) — skill: `laravel-testing`

## Implementation checklist

```
- [ ] Migration + indexes (database-indexing-queries rule)
- [ ] Model: fillable, scopes, softDeletes
- [ ] Repository: extend BaseRepository
- [ ] Form Request: store + update
- [ ] API Resource
- [ ] Controller: thin, inject repository
- [ ] Route: public v1 or admin + middleware
- [ ] Feature test (RefreshDatabase)
- [ ] clearCache() on CUD verified
```

## Repository example

```php
class NewsRepository extends BaseRepository
{
    protected function model(): string { return News::class; }

    protected function defaultSelect(): array
    {
        return ['id', 'title', 'slug', 'thumbnail', 'published_at', 'school_id'];
    }

    protected function defaultWith(): array
    {
        return ['school:id,name,slug'];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'excerpt'];
    }
}
```

## Testing

```php
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class); // if Pest added later

class AdminNewsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_news(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson('/api/admin/news', [
            'title' => 'Judul Berita',
            'slug' => 'judul-berita',
            'school_id' => School::factory()->create()->id,
        ])->assertCreated();
    }
}
```

Run: `make test-backend`

## Related

- Rules: `laravel-development.mdc`, `backend-cache-performance.mdc`, `owasp-security.mdc`
- Skills: `laravel-specialist`, `laravel-patterns`, `laravel-testing`, `pest-testing`
