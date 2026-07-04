<?php

namespace Tests\Feature\Api;

use App\Models\School;
use App\Services\TranslationService;
use Mockery;
use Tests\TestCase;

class TranslateResponseMiddlewareTest extends TestCase
{
    public function test_response_unchanged_for_indonesian_locale(): void
    {
        $school = School::factory()->create(['name' => 'Nurul Hikmah']);

        $response = $this->getJson('/api/v1/schools', ['X-Locale' => 'id']);

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNotEmpty($data);

        $schoolData = collect($data)->firstWhere('slug', $school->slug);
        $this->assertSame('Nurul Hikmah', $schoolData['name']);
    }

    public function test_response_unchanged_without_locale_header(): void
    {
        $school = School::factory()->create(['name' => 'Nurul Hikmah']);

        $response = $this->getJson('/api/v1/schools');

        $response->assertOk();
        $data = $response->json('data');
        $schoolData = collect($data)->firstWhere('slug', $school->slug);
        $this->assertSame('Nurul Hikmah', $schoolData['name']);
    }

    public function test_response_unchanged_for_unsupported_locale(): void
    {
        $school = School::factory()->create(['name' => 'Nurul Hikmah']);

        $response = $this->getJson('/api/v1/schools', ['X-Locale' => 'zz']);

        $response->assertOk();
        $data = $response->json('data');
        $schoolData = collect($data)->firstWhere('slug', $school->slug);
        $this->assertSame('Nurul Hikmah', $schoolData['name']);
    }

    public function test_lang_query_param_is_accepted(): void
    {
        School::factory()->create(['name' => 'Sekolah']);

        $response = $this->getJson('/api/v1/schools?lang=id');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertSame('Sekolah', $data[0]['name']);
    }

    public function test_skipped_fields_not_translated(): void
    {
        $mock = Mockery::mock(TranslationService::class);
        $mock->shouldReceive('isSupported')->with('en')->andReturn(true);
        $mock->shouldReceive('translateBatch')->andReturnUsing(function (array $texts) {
            return array_combine($texts, $texts);
        });
        $this->app->instance(TranslationService::class, $mock);

        $school = School::factory()->create([
            'slug' => 'my-school',
            'email' => 'info@school.id',
        ]);

        $response = $this->getJson('/api/v1/schools/' . $school->slug, ['X-Locale' => 'en']);

        $response->assertOk();
        $data = $response->json('data');

        $this->assertSame('my-school', $data['slug']);
        $this->assertSame('info@school.id', $data['email']);
    }

    public function test_middleware_accepts_x_locale_header(): void
    {
        $mock = Mockery::mock(TranslationService::class);
        $mock->shouldReceive('isSupported')->with('en')->andReturn(true);
        $mock->shouldReceive('translateBatch')->andReturnUsing(function (array $texts) {
            return array_combine($texts, $texts);
        });
        $this->app->instance(TranslationService::class, $mock);

        School::factory()->create();

        $response = $this->getJson('/api/v1/schools', ['X-Locale' => 'en']);

        $response->assertOk();
        $this->assertNotEmpty($response->json('data'));
    }
}
