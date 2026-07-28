<?php

namespace Tests\Feature\Admin;

use Illuminate\Support\Str;
use Tests\Concerns\AssertsAdminCrud;
use Tests\TestCase;

class SettingAdminTest extends TestCase
{
    use AssertsAdminCrud;

    private const RESOURCE = 'settings';

    private function validPayload(): array
    {
        return [
            'group' => 'general',
            'key' => 'site_name_'.Str::random(6),
            'value' => 'Nurul Hikmah',
        ];
    }

    public function test_guest_cannot_access(): void
    {
        $this->assertAdminGuestCannotAccess(self::RESOURCE);
    }

    public function test_non_admin_forbidden(): void
    {
        $this->assertNonAdminForbidden(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_index(): void
    {
        $this->assertAdminCanIndex(self::RESOURCE);
    }

    public function test_store_validation_fails(): void
    {
        $this->assertAdminStoreValidationFails(self::RESOURCE, [], ['group', 'key']);
    }

    public function test_admin_can_store(): void
    {
        $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
    }

    public function test_admin_can_show(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminShow(self::RESOURCE, $id);
    }

    public function test_admin_can_update(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminUpdate(self::RESOURCE, $id, ['value' => 'Updated Value']);
    }

    public function test_admin_can_destroy(): void
    {
        $id = $this->assertAdminStoreSuccess(self::RESOURCE, $this->validPayload());
        $this->assertAdminDestroy(self::RESOURCE, $id);
    }

    public function test_admin_can_update_hero_collage_json(): void
    {
        $setting = \App\Models\Setting::factory()->create([
            'group' => 'homepage',
            'key' => 'hero_collage',
            'type' => 'json',
            'value' => json_encode(\App\Support\HeroCollage::defaultPayload(), JSON_UNESCAPED_UNICODE),
        ]);

        $payload = \App\Support\HeroCollage::defaultPayload();
        $payload['subtitle'] = 'Belajar dengan penuh semangat';
        $payload['items'][0]['label'] = 'Tahfiz';

        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/'.$setting->id, [
                'value' => json_encode($payload, JSON_UNESCAPED_UNICODE),
                'type' => 'json',
            ])
            ->assertOk()
            ->assertJsonPath('data.key', 'hero_collage');

        $stored = json_decode((string) $setting->fresh()->value, true);
        $this->assertSame('Belajar dengan penuh semangat', $stored['subtitle']);
        $this->assertSame('Tahfiz', $stored['items'][0]['label']);
    }

    public function test_admin_hero_collage_update_rejects_invalid_payload(): void
    {
        $setting = \App\Models\Setting::factory()->create([
            'group' => 'homepage',
            'key' => 'hero_collage',
            'type' => 'json',
            'value' => json_encode(\App\Support\HeroCollage::defaultPayload(), JSON_UNESCAPED_UNICODE),
        ]);

        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/'.$setting->id, [
                'value' => json_encode([
                    'subtitle' => 'x',
                    'items' => [
                        ['label' => 'A', 'color' => 'from-primary/30 to-primary/10'],
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'type' => 'json',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['value']);
    }

    public function test_admin_can_update_splash_screen_json(): void
    {
        $setting = \App\Models\Setting::factory()->create([
            'group' => 'homepage',
            'key' => 'splash_screen',
            'type' => 'json',
            'value' => json_encode(\App\Support\SplashScreen::defaultPayload(), JSON_UNESCAPED_UNICODE),
        ]);

        $payload = \App\Support\SplashScreen::defaultPayload();
        $payload['title'] = 'Selamat Datang';
        $payload['image'] = 'https://cdn.example.com/splash.png';

        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/'.$setting->id, [
                'value' => json_encode($payload, JSON_UNESCAPED_UNICODE),
                'type' => 'json',
            ])
            ->assertOk()
            ->assertJsonPath('data.key', 'splash_screen');

        $stored = json_decode((string) $setting->fresh()->value, true);
        $this->assertSame('Selamat Datang', $stored['title']);
        $this->assertSame('https://cdn.example.com/splash.png', $stored['image']);
    }

    public function test_admin_splash_screen_update_rejects_invalid_payload(): void
    {
        $setting = \App\Models\Setting::factory()->create([
            'group' => 'homepage',
            'key' => 'splash_screen',
            'type' => 'json',
            'value' => json_encode(\App\Support\SplashScreen::defaultPayload(), JSON_UNESCAPED_UNICODE),
        ]);

        $payload = \App\Support\SplashScreen::defaultPayload();
        $payload['title'] = '';

        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/'.$setting->id, [
                'value' => json_encode($payload, JSON_UNESCAPED_UNICODE),
                'type' => 'json',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['value']);
    }
}
