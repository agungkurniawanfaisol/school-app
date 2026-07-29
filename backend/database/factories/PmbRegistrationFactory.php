<?php

namespace Database\Factories;

use App\Models\PmbRegistration;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PmbRegistration>
 */
class PmbRegistrationFactory extends Factory
{
    protected $model = PmbRegistration::class;

    public function definition(): array
    {
        return [
            'school_id' => School::factory(),
            'registration_number' => 'PMB-'.now()->format('Ymd').'-'.strtoupper(Str::random(6)),
            'tracking_token' => Str::random(64),
            'student_name' => fake()->name(),
            'birth_place' => fake()->city(),
            'birth_date' => fake()->date(),
            'gender' => fake()->randomElement(['L', 'P']),
            'parent_name' => fake()->name(),
            'parent_phone' => '08'.fake()->numerify('##########'),
            'parent_email' => fake()->safeEmail(),
            'address' => fake()->address(),
            'grade_applied' => 'SD',
            'academic_year' => '2026/2027',
            'user_id' => null,
            'status' => 'draft',
            'current_step' => 1,
        ];
    }

    public function submitted(): static
    {
        return $this->state(fn () => ['status' => PmbRegistration::STATUS_AWAITING_VERIFICATION]);
    }

    public function needsRevision(): static
    {
        return $this->state(fn () => ['status' => PmbRegistration::STATUS_NEEDS_REVISION]);
    }

    public function forUser(\App\Models\User $user): static
    {
        return $this->state(fn () => ['user_id' => $user->id]);
    }
}
