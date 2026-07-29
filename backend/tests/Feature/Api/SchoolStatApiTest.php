<?php

namespace Tests\Feature\Api;

use App\Models\SchoolStat;
use Tests\TestCase;

class SchoolStatApiTest extends TestCase
{
    public function test_list_returns_only_active_school_stats(): void
    {
        $active = SchoolStat::factory()->create([
            'label' => 'Berdiri',
            'value' => '1998',
        ]);
        SchoolStat::factory()->inactive()->create();

        $response = $this->getJson('/api/v1/school-stats');

        $response->assertOk()
            ->assertJsonStructure(['data'])
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.uuid', $active->uuid)
            ->assertJsonPath('data.0.label', 'Berdiri')
            ->assertJsonPath('data.0.value', '1998');

        $this->assertArrayNotHasKey('id', $response->json('data.0'));
    }

    public function test_public_list_exposes_uuid_not_id(): void
    {
        SchoolStat::factory()->create([
            'label' => 'Siswa',
            'value' => '500+',
            'icon' => 'users',
        ]);

        $response = $this->getJson('/api/v1/school-stats');

        $response->assertOk()
            ->assertJsonPath('data.0.label', 'Siswa')
            ->assertJsonStructure(['data' => [['uuid', 'label', 'value', 'icon', 'order', 'is_active']]]);

        $this->assertArrayNotHasKey('id', $response->json('data.0'));
    }
}
