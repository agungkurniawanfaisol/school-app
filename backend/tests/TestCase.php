<?php

namespace Tests;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        // Docker Compose sets DB_* in $_SERVER; PHPUnit <env force> updates
        // putenv/$_ENV but Laravel's env() prefers $_SERVER — pin sqlite first.
        $this->forceSqliteTestingDatabase();

        parent::setUp();
        config(['queue.default' => 'sync']);
        $this->withoutMiddleware(ThrottleRequests::class);
    }

    private function forceSqliteTestingDatabase(): void
    {
        putenv('DB_CONNECTION=sqlite');
        putenv('DB_DATABASE=:memory:');
        putenv('DB_URL');
        putenv('QUEUE_CONNECTION=sync');
        $_ENV['DB_CONNECTION'] = 'sqlite';
        $_ENV['DB_DATABASE'] = ':memory:';
        $_ENV['DB_URL'] = '';
        $_ENV['QUEUE_CONNECTION'] = 'sync';
        $_SERVER['DB_CONNECTION'] = 'sqlite';
        $_SERVER['DB_DATABASE'] = ':memory:';
        $_SERVER['DB_URL'] = '';
        $_SERVER['QUEUE_CONNECTION'] = 'sync';
    }

    protected function createSchool(array $attributes = []): School
    {
        return School::factory()->create($attributes);
    }

    protected function actingAsAdmin(?User $user = null): static
    {
        $user ??= User::factory()->admin()->create();

        return $this->actingAs($user, 'sanctum');
    }

    protected function actingAsUser(?User $user = null): static
    {
        $user ??= User::factory()->guru()->create();

        return $this->actingAs($user, 'sanctum');
    }

    protected function actingAsGuru(?User $user = null): static
    {
        $user ??= User::factory()->guru()->create();

        return $this->actingAs($user, 'sanctum');
    }

    protected function sanctumAdmin(?User $user = null): User
    {
        $user ??= User::factory()->admin()->create();
        Sanctum::actingAs($user);

        return $user;
    }
}
