<?php

namespace Tests\Feature\Api;

use App\Models\Setting;
use App\Support\HeroCollage;
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
}
