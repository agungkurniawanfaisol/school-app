<?php

namespace Tests\Feature\Api;

use App\Models\VirtualTour;
use App\Models\VirtualTourHotspot;
use App\Models\VirtualTourScene;
use Tests\TestCase;

class VirtualTourApiTest extends TestCase
{
    public function test_guest_can_list_active_virtual_tours(): void
    {
        VirtualTour::factory()->count(2)->create(['is_active' => true]);
        VirtualTour::factory()->inactive()->create();

        $this->getJson('/api/v1/virtual-tours')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_guest_can_view_virtual_tour_by_slug_with_pannellum_config(): void
    {
        $tour = VirtualTour::factory()->create(['slug' => 'tur-fasilitas', 'is_active' => true]);
        $sceneA = VirtualTourScene::factory()->create(['virtual_tour_id' => $tour->id, 'order' => 0]);
        $sceneB = VirtualTourScene::factory()->create(['virtual_tour_id' => $tour->id, 'order' => 1]);
        $tour->update(['start_scene_id' => $sceneA->id]);

        VirtualTourHotspot::factory()->create([
            'virtual_tour_scene_id' => $sceneA->id,
            'target_scene_id' => $sceneB->id,
            'label' => 'Lanjut',
            'pitch' => 0,
            'yaw' => 90,
        ]);

        $this->getJson('/api/v1/virtual-tours/tur-fasilitas')
            ->assertOk()
            ->assertJsonPath('data.slug', 'tur-fasilitas')
            ->assertJsonPath('data.pannellum.default.firstScene', $sceneA->uuid)
            ->assertJsonPath("data.pannellum.scenes.{$sceneA->uuid}.hotSpots.0.text", 'Lanjut');
    }

    public function test_inactive_virtual_tour_returns_404(): void
    {
        VirtualTour::factory()->inactive()->create(['slug' => 'draft-tour']);

        $this->getJson('/api/v1/virtual-tours/draft-tour')->assertNotFound();
    }
}
