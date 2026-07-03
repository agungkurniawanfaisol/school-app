<?php

namespace Database\Factories;

use App\Models\PmbDocument;
use App\Models\PmbRegistration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PmbDocument>
 */
class PmbDocumentFactory extends Factory
{
    protected $model = PmbDocument::class;

    public function definition(): array
    {
        return [
            'pmb_registration_id' => PmbRegistration::factory(),
            'document_type' => fake()->randomElement(['kk', 'akte', 'rapor']),
            'file_path' => '/storage/pmb/'.fake()->uuid().'.pdf',
            'original_name' => 'dokumen.pdf',
            'status' => 'pending',
        ];
    }
}
