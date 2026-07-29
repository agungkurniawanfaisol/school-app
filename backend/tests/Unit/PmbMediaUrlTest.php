<?php

namespace Tests\Unit;

use App\Models\Media;
use App\Support\PmbMediaUrl;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class PmbMediaUrlTest extends TestCase
{
    public function test_pmb_local_media_returns_relative_signed_url(): void
    {
        Storage::fake('local');

        $media = Media::factory()->create([
            'collection' => 'pmb',
            'mime_type' => 'image/jpeg',
            'path' => 'uploads/pmb/student.jpg',
            'disk' => 'local',
            'uuid' => '62a082eb-790c-41fe-9b28-941753b030d5',
        ]);

        $url = PmbMediaUrl::resolve($media);

        $this->assertIsString($url);
        $this->assertStringStartsWith('/api/v1/pmb/portal/media/', $url);
        $this->assertStringNotContainsString('://', $url);
        $this->assertStringContainsString('signature=', $url);
        $this->assertTrue(URL::hasValidSignature(
            request()->create($url, 'GET'),
            absolute: false,
        ));
    }

    public function test_public_disk_returns_storage_path(): void
    {
        $media = Media::factory()->create([
            'collection' => 'news',
            'path' => 'uploads/news/a.jpg',
            'disk' => 'public',
        ]);

        $this->assertSame('/storage/uploads/news/a.jpg', PmbMediaUrl::resolve($media));
    }
}
