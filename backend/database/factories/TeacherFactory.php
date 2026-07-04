<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Teacher>
 */
class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition(): array
    {
        $name = fake()->name();

        return [
            'school_id' => School::factory(),
            'type' => Teacher::TYPE_GURU,
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'title' => fake()->jobTitle(),
            'subject' => fake()->randomElement(['Matematika', 'Bahasa Arab', 'Tahfidz']),
            'bio' => fake()->paragraph(),
            'order' => fake()->numberBetween(0, 10),
            'is_active' => true,
            'is_featured' => false,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }

    public function kepalaSekolah(): static
    {
        return $this->state(fn () => ['type' => Teacher::TYPE_KEPALA_SEKOLAH]);
    }

    public function staff(): static
    {
        return $this->state(fn () => ['type' => Teacher::TYPE_STAFF]);
    }
}
