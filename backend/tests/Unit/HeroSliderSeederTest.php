<?php

namespace Tests\Unit;

use App\Models\HeroSlider;
use App\Models\School;
use App\Models\User;
use Database\Seeders\DemoContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class HeroSliderSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seeder_creates_three_active_hero_sliders_with_images(): void
    {
        School::factory()->create(['slug' => 'nurul-hikmah']);
        User::factory()->create([
            'email' => 'admin@nurulhikmah.sch.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $this->seed(DemoContentSeeder::class);

        $sliders = HeroSlider::query()->where('is_active', true)->orderBy('order')->get();

        $this->assertGreaterThanOrEqual(3, $sliders->count());
        foreach ($sliders->take(3) as $slider) {
            $this->assertNotEmpty($slider->image);
            $this->assertStringStartsWith('https://', $slider->image);
        }
    }
}
