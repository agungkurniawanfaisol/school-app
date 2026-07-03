<?php

namespace Tests\Unit;

use App\Support\AllowedFrontendUrl;
use Tests\TestCase;

class AllowedFrontendUrlTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        putenv('SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:8000');
        config([
            'services.google.frontend_url' => 'http://localhost:5173',
        ]);
    }

    public function test_allows_configured_frontend_in_stateful_domains(): void
    {
        $this->assertTrue(AllowedFrontendUrl::isAllowed('http://localhost:5173'));
        $this->assertSame('http://localhost:5173/admin/login', AllowedFrontendUrl::to('/admin/login'));
    }

    public function test_rejects_frontend_not_in_stateful_domains(): void
    {
        config(['services.google.frontend_url' => 'https://evil.example']);

        $this->assertFalse(AllowedFrontendUrl::isAllowed('https://evil.example'));
        $this->assertSame('http://localhost:5173', AllowedFrontendUrl::base());
    }
}
