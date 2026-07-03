<?php

namespace Tests\Feature\Admin;

use App\Models\School;
use App\Models\VirtualTour;
use App\Models\VirtualTourScene;
use Tests\TestCase;

class VirtualTourAdminTest extends TestCase
{
    private function validPayload(?School $school = null): array
    {
        $school ??= $this->createSchool();

        return [
            'school_id' => $school->id,
            'title' => 'Tur Sekolah',
            'slug' => 'tur-sekolah',
            'description' => 'Jelajahi fasilitas sekolah',
            'is_active' => true,
            'scenes' => [
                [
                    'title' => 'Gerbang',
                    'image' => '/storage/uploads/virtual-tour/gate.jpg',
                    'initial_pitch' => 0,
                    'initial_yaw' => 0,
                    'order' => 0,
                    'hotspots' => [],
                ],
            ],
        ];
    }

    public function test_guest_cannot_access(): void
    {
        $this->getJson('/api/admin/virtual-tours')->assertUnauthorized();
    }

    public function test_admin_can_create_virtual_tour_with_scene(): void
    {
        $payload = $this->validPayload();

        $this->actingAsAdmin()
            ->postJson('/api/admin/virtual-tours', $payload)
            ->assertCreated()
            ->assertJsonPath('data.title', 'Tur Sekolah')
            ->assertJsonCount(1, 'data.scenes');

        $this->assertDatabaseHas('virtual_tours', ['slug' => 'tur-sekolah']);
        $this->assertDatabaseHas('virtual_tour_scenes', ['title' => 'Gerbang']);
    }

    public function test_admin_can_update_with_hotspot_navigation(): void
    {
        $tour = VirtualTour::factory()->create(['school_id' => $this->createSchool()->id]);
        $sceneA = VirtualTourScene::factory()->create([
            'virtual_tour_id' => $tour->id,
            'title' => 'Lobby',
            'order' => 0,
        ]);
        $sceneB = VirtualTourScene::factory()->create([
            'virtual_tour_id' => $tour->id,
            'title' => 'Kelas',
            'order' => 1,
        ]);

        $this->actingAsAdmin()
            ->putJson("/api/admin/virtual-tours/{$tour->uuid}", [
                'title' => $tour->title,
                'slug' => $tour->slug,
                'start_scene_uuid' => $sceneA->uuid,
                'scenes' => [
                    [
                        'uuid' => $sceneA->uuid,
                        'title' => 'Lobby',
                        'image' => $sceneA->image,
                        'order' => 0,
                        'hotspots' => [
                            [
                                'target_scene_uuid' => $sceneB->uuid,
                                'label' => 'Ke Ruang Kelas',
                                'pitch' => 5.5,
                                'yaw' => 120,
                            ],
                        ],
                    ],
                    [
                        'uuid' => $sceneB->uuid,
                        'title' => 'Kelas',
                        'image' => $sceneB->image,
                        'order' => 1,
                        'hotspots' => [],
                    ],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('data.scenes.0.hotspots.0.label', 'Ke Ruang Kelas');

        $this->assertDatabaseHas('virtual_tour_hotspots', [
            'virtual_tour_scene_id' => $sceneA->id,
            'target_scene_id' => $sceneB->id,
            'label' => 'Ke Ruang Kelas',
        ]);
    }

    public function test_admin_update_syncs_hotspots_when_scenes_are_not_sequential_order(): void
    {
        $tour = VirtualTour::factory()->create(['school_id' => $this->createSchool()->id]);
        $sceneA = VirtualTourScene::factory()->create([
            'virtual_tour_id' => $tour->id,
            'title' => 'Lobby',
            'order' => 5,
        ]);
        $sceneB = VirtualTourScene::factory()->create([
            'virtual_tour_id' => $tour->id,
            'title' => 'Kelas',
            'order' => 10,
        ]);

        $this->actingAsAdmin()
            ->putJson("/api/admin/virtual-tours/{$tour->uuid}", [
                'title' => $tour->title,
                'slug' => $tour->slug,
                'start_scene_uuid' => $sceneA->uuid,
                'scenes' => [
                    [
                        'uuid' => $sceneB->uuid,
                        'title' => 'Kelas',
                        'image' => $sceneB->image,
                        'order' => 10,
                        'hotspots' => [],
                    ],
                    [
                        'uuid' => $sceneA->uuid,
                        'title' => 'Lobby',
                        'image' => $sceneA->image,
                        'order' => 5,
                        'hotspots' => [
                            [
                                'target_scene_uuid' => $sceneB->uuid,
                                'label' => 'Ke Kelas',
                                'pitch' => 0,
                                'yaw' => 45,
                            ],
                        ],
                    ],
                ],
            ])
            ->assertOk();

        $this->assertDatabaseHas('virtual_tour_hotspots', [
            'virtual_tour_scene_id' => $sceneA->id,
            'target_scene_id' => $sceneB->id,
            'label' => 'Ke Kelas',
        ]);
    }

    public function test_admin_can_show_by_uuid(): void
    {
        $tour = VirtualTour::factory()->create();
        VirtualTourScene::factory()->create(['virtual_tour_id' => $tour->id]);

        $this->actingAsAdmin()
            ->getJson("/api/admin/virtual-tours/{$tour->uuid}")
            ->assertOk()
            ->assertJsonPath('data.uuid', $tour->uuid)
            ->assertJsonStructure(['data' => ['pannellum' => ['default', 'scenes']]]);
    }
}
