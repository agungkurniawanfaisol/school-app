<?php

namespace Tests\Feature\Admin;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UploadAdminTest extends TestCase
{
    public function test_guest_cannot_upload(): void
    {
        Storage::fake('public');

        $this->postJson('/api/admin/uploads', [
            'collection' => 'news',
        ])->assertUnauthorized();
    }

    public function test_non_admin_cannot_upload(): void
    {
        Storage::fake('public');

        $this->actingAsUser()
            ->postJson('/api/admin/uploads', [
                'file' => UploadedFile::fake()->image('photo.jpg'),
                'collection' => 'news',
            ])
            ->assertForbidden();
    }

    public function test_admin_can_upload_image(): void
    {
        Storage::fake('public');

        $response = $this->actingAsAdmin()
            ->post('/api/admin/uploads', [
                'file' => UploadedFile::fake()->image('photo.jpg', 800, 600),
                'collection' => 'news',
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonStructure([
                'message',
                'data' => ['uuid', 'url', 'path', 'mime_type', 'size'],
            ]);

        $path = $response->json('data.path');
        Storage::disk('public')->assertExists($path);

        $url = $response->json('data.url');
        $this->assertStringStartsWith('/storage/', $url);
    }

    public function test_admin_upload_rejects_invalid_mime(): void
    {
        Storage::fake('public');

        $this->actingAsAdmin()
            ->post('/api/admin/uploads', [
                'file' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
                'collection' => 'news',
            ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }
}
