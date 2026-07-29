<?php

namespace Database\Factories;

use App\Models\StudentActivity;
use App\Models\StudentActivityPhoto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudentActivityPhoto>
 */
class StudentActivityPhotoFactory extends Factory
{
    protected $model = StudentActivityPhoto::class;

    public function definition(): array
    {
        return [
            'student_activity_id' => StudentActivity::factory(),
            'path' => '/storage/activities/'.fake()->uuid().'.jpg',
            'caption' => fake()->sentence(),
            'order' => fake()->numberBetween(0, 5),
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
