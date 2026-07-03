<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\VirtualTour;
use Database\Seeders\VirtualTourSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VirtualTourSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_five_scene_virtual_tour(): void
    {
        Storage::fake('public');

        School::factory()->create(['slug' => 'nurul-hikmah']);

        Http::fake([
            '*' => Http::response(str_repeat('0', 50_000), 200, ['Content-Type' => 'image/jpeg']),
        ]);

        $this->seed(VirtualTourSeeder::class);

        $tour = VirtualTour::query()->with(['scenes.hotspots'])->where('slug', 'tur-sekolah')->first();

        $this->assertNotNull($tour);
        $this->assertTrue($tour->is_active);
        $this->assertCount(5, $tour->scenes);

        $sceneWithHotspot = $tour->scenes->first();
        $this->assertNotNull($sceneWithHotspot);
        $this->assertCount(1, $sceneWithHotspot->hotspots);
        $this->assertSame('Ke halaman sekolah', $sceneWithHotspot->hotspots->first()->label);

        $this->getJson('/api/v1/virtual-tours/tur-sekolah')
            ->assertOk()
            ->assertJsonPath('data.slug', 'tur-sekolah')
            ->assertJsonCount(5, 'data.scenes');
    }
}
