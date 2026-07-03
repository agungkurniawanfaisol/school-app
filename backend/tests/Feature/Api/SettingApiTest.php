<?php

namespace Tests\Feature\Api;

use App\Models\Setting;
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
}
