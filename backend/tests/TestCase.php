<?php

namespace Tests;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

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
