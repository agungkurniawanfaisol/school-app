<?php

namespace Tests\Feature\Admin;

use App\Models\AppRelease;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class AppReleaseAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'app-releases';

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'version' => '1.0.0',
            'title' => 'Rilis awal',
            'body' => "• Perbaikan awal\n• Versi pertama",
            'is_published' => true,
            'published_at' => now()->toIso8601String(),
        ], $overrides);
    }

    public function test_guest_cannot_access_admin(): void
    {
        $this->assertAdminGuestCannotAccess(self::RESOURCE);
    }

    public function test_admin_can_store_release(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload())
            ->assertCreated()
            ->assertJsonPath('data.version', '1.0.0')
            ->assertJsonPath('data.is_published', true);

        $this->assertDatabaseHas('app_releases', [
            'version' => '1.0.0',
            'title' => 'Rilis awal',
        ]);
    }

    public function test_public_lists_only_published(): void
    {
        AppRelease::factory()->published()->create([
            'version' => '1.0.0',
            'title' => 'Publik',
        ]);
        AppRelease::factory()->draft()->create([
            'version' => '1.0.1',
            'title' => 'Draft',
        ]);

        $this->getJson('/api/v1/app-releases')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.version', '1.0.0');
    }

    public function test_duplicate_version_rejected(): void
    {
        AppRelease::factory()->create(['version' => '1.0.0']);
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson($this->adminUrl(self::RESOURCE), $this->validPayload([
            'version' => '1.0.0',
            'title' => 'Duplikat',
        ]))->assertUnprocessable();
    }
}
