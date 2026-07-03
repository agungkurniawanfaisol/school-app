<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\School;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'school_id' => School::factory(),
            'user_id' => User::factory()->admin(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'excerpt' => fake()->sentence(),
            'content' => fake()->paragraphs(2, true),
            'category' => fake()->word(),
            'status' => 'published',
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
            'is_featured' => false,
            'published_at' => now()->subDay(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => 'draft',
            'published_at' => null,
            'publish_ends_at' => null,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => now()->subDay(),
            'publish_ends_at' => null,
            'is_active' => true,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => now()->addDay(),
            'publish_ends_at' => null,
            'is_active' => true,
        ]);
    }

    public function ended(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => now()->subDays(3),
            'publish_ends_at' => now()->subDay(),
            'is_active' => true,
        ]);
    }
}
