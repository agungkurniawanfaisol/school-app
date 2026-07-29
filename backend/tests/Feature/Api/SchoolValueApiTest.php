<?php

namespace Tests\Feature\Api;

use App\Models\SchoolValue;
use Tests\TestCase;

class SchoolValueApiTest extends TestCase
{
    public function test_list_returns_only_active_school_values(): void
    {
        $active = SchoolValue::factory()->create([
            'title' => 'Akhlak',
            'description' => 'Deskripsi aktif.',
        ]);
        SchoolValue::factory()->inactive()->create();

        $response = $this->getJson('/api/v1/school-values');

        $response->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.uuid', $active->uuid)
            ->assertJsonPath('data.0.title', 'Akhlak');

        $this->assertArrayNotHasKey('id', $response->json('data.0'));
    }

    public function test_public_list_exposes_uuid_not_id(): void
    {
        SchoolValue::factory()->create([
            'title' => 'Ilmu',
            'description' => 'Deskripsi ilmu.',
            'icon' => 'sparkles',
        ]);

        $response = $this->getJson('/api/v1/school-values');

        $response->assertOk()
            ->assertJsonPath('data.0.title', 'Ilmu')
            ->assertJsonStructure(['data' => [['uuid', 'title', 'description', 'icon', 'order', 'is_active']]]);

        $this->assertArrayNotHasKey('id', $response->json('data.0'));
    }
}
