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
            'app.url' => 'http://localhost:8000',
            'services.google.frontend_url' => 'http://localhost:5173',
        ]);
    }

    public function test_allows_configured_frontend_in_stateful_domains(): void
    {
        $this->assertTrue(AllowedFrontendUrl::isAllowed('http://localhost:5173'));
        $this->assertSame('http://localhost:5173/admin/login', AllowedFrontendUrl::to('/admin/login'));
    }

    public function test_falls_back_to_app_url_when_frontend_not_allowed(): void
    {
        putenv('SANCTUM_STATEFUL_DOMAINS=nurulhikmahsda.sch.id,localhost:8000');
        config([
            'app.env' => 'production',
            'app.url' => 'https://nurulhikmahsda.sch.id',
            'services.google.frontend_url' => 'https://evil.example',
        ]);

        $this->assertFalse(AllowedFrontendUrl::isAllowed('https://evil.example'));
        $this->assertSame('https://nurulhikmahsda.sch.id', AllowedFrontendUrl::base());
        $this->assertSame(
            'https://nurulhikmahsda.sch.id/admin/login',
            AllowedFrontendUrl::to('/admin/login'),
        );
    }

    public function test_local_fallback_when_nothing_allowed(): void
    {
        putenv('SANCTUM_STATEFUL_DOMAINS=other.example');
        config([
            'app.env' => 'local',
            'app.url' => 'https://evil.example',
            'services.google.frontend_url' => 'https://evil.example',
        ]);

        $this->assertSame('http://localhost:5173', AllowedFrontendUrl::base());
    }
}
