<?php

namespace Tests\Feature\Api;

use App\Models\Setting;
use App\Support\HeroCollage;
use App\Support\SplashScreen;
use Tests\TestCase;

class SettingApiTest extends TestCase
{
    public function test_index_returns_settings_data(): void
    {
        Setting::factory()->count(2)->create(['group' => 'general']);

        $this->getJson('/api/v1/settings')
            ->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(2, 'data');
    }

    public function test_index_returns_homepage_hero_collage(): void
    {
        Setting::factory()->create([
            'group' => 'homepage',
            'key' => 'hero_collage',
            'type' => 'json',
            'value' => json_encode(HeroCollage::defaultPayload(), JSON_UNESCAPED_UNICODE),
        ]);

        $this->getJson('/api/v1/settings?group=homepage')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.key', 'hero_collage')
            ->assertJsonPath('data.0.type', 'json');

        $value = json_decode((string) $this->getJson('/api/v1/settings?group=homepage')->json('data.0.value'), true);
        $this->assertIsArray($value);
        $this->assertArrayHasKey('subtitle', $value);
        $this->assertCount(4, $value['items']);
    }

    public function test_index_returns_homepage_splash_screen(): void
    {
        Setting::factory()->create([
            'group' => 'homepage',
            'key' => 'splash_screen',
            'type' => 'json',
            'value' => json_encode(SplashScreen::defaultPayload(), JSON_UNESCAPED_UNICODE),
        ]);

        $this->getJson('/api/v1/settings?group=homepage')
            ->assertOk()
            ->assertJsonPath('data.0.key', 'splash_screen')
            ->assertJsonPath('data.0.type', 'json');

        $value = json_decode((string) $this->getJson('/api/v1/settings?group=homepage')->json('data.0.value'), true);
        $this->assertSame('Sekolah Islam Nurul Hikmah', $value['title']);
        $this->assertSame(2500, $value['duration_ms']);
    }

    public function test_pmb_group_exposes_bank_transfer_settings_when_present(): void
    {
        $school = \App\Models\School::factory()->create();

        Setting::factory()->create([
            'school_id' => $school->id,
            'group' => 'pmb',
            'key' => 'pmb_bank_name',
            'value' => 'Bank Syariah Indonesia (BSI)',
            'type' => 'string',
        ]);
        Setting::factory()->create([
            'school_id' => $school->id,
            'group' => 'pmb',
            'key' => 'pmb_account_number',
            'value' => '7123456789',
            'type' => 'string',
        ]);
        Setting::factory()->create([
            'school_id' => $school->id,
            'group' => 'pmb',
            'key' => 'pmb_account_holder',
            'value' => 'Yayasan Nurul Hikmah',
            'type' => 'string',
        ]);

        $response = $this->getJson('/api/v1/settings?group=pmb&school_id='.$school->id)
            ->assertOk();

        $keys = collect($response->json('data'))->pluck('key')->all();
        $this->assertContains('pmb_bank_name', $keys);
        $this->assertContains('pmb_account_number', $keys);
        $this->assertContains('pmb_account_holder', $keys);
        $this->assertSame(
            'Bank Syariah Indonesia (BSI)',
            collect($response->json('data'))->firstWhere('key', 'pmb_bank_name')['value'],
        );
    }
}
