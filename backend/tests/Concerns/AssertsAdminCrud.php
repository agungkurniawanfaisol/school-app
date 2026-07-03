<?php

namespace Tests\Concerns;

trait AssertsAdminCrud
{
    protected function adminUrl(string $resource): string
    {
        return '/api/admin/'.$resource;
    }

    protected function assertAdminGuestCannotAccess(string $resource): void
    {
        $this->getJson($this->adminUrl($resource))->assertUnauthorized();
        $this->postJson($this->adminUrl($resource), [])->assertUnauthorized();
    }

    protected function assertNonAdminForbidden(string $resource, array $payload = []): void
    {
        $this->actingAsUser()
            ->getJson($this->adminUrl($resource))
            ->assertForbidden();

        $this->actingAsUser()
            ->postJson($this->adminUrl($resource), $payload)
            ->assertForbidden();
    }

    protected function assertAdminCanIndex(string $resource): void
    {
        $this->actingAsAdmin()
            ->getJson($this->adminUrl($resource))
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    protected function assertAdminStoreValidationFails(string $resource, array $payload, array $expectedErrors): void
    {
        $this->actingAsAdmin()
            ->postJson($this->adminUrl($resource), $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors($expectedErrors);
    }

    protected function assertAdminStoreSuccess(string $resource, array $payload): int
    {
        $response = $this->actingAsAdmin()
            ->postJson($this->adminUrl($resource), $payload);

        $response->assertCreated()
            ->assertJsonStructure(['message', 'data']);

        return (int) $response->json('data.id');
    }

    protected function assertAdminStoreSuccessUuid(string $resource, array $payload): string
    {
        $response = $this->actingAsAdmin()
            ->postJson($this->adminUrl($resource), $payload);

        $response->assertCreated()
            ->assertJsonStructure(['message', 'data']);

        return (string) $response->json('data.uuid');
    }

    protected function assertAdminShow(string $resource, string|int $key): void
    {
        $response = $this->actingAsAdmin()
            ->getJson($this->adminUrl($resource).'/'.$key)
            ->assertOk()
            ->assertJsonStructure(['data']);

        if (is_string($key)) {
            $response->assertJsonPath('data.uuid', $key);
        } else {
            $response->assertJsonPath('data.id', $key);
        }
    }

    protected function assertAdminShowNotFound(string $resource, string|int $key): void
    {
        $this->actingAsAdmin()
            ->getJson($this->adminUrl($resource).'/'.$key)
            ->assertNotFound();
    }

    protected function assertAdminUpdate(string $resource, string|int $key, array $payload): void
    {
        $this->actingAsAdmin()
            ->putJson($this->adminUrl($resource).'/'.$key, $payload)
            ->assertOk()
            ->assertJsonStructure(['message', 'data']);
    }

    protected function assertAdminDestroy(string $resource, string|int $key): void
    {
        $this->actingAsAdmin()
            ->deleteJson($this->adminUrl($resource).'/'.$key)
            ->assertOk();
    }
}
