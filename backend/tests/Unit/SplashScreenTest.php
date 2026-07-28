<?php

namespace Tests\Unit;

use App\Support\SplashScreen;
use Tests\TestCase;

class SplashScreenTest extends TestCase
{
    public function test_default_payload_is_valid(): void
    {
        $errors = SplashScreen::validateValue(json_encode(SplashScreen::defaultPayload(), JSON_UNESCAPED_UNICODE));

        $this->assertSame([], $errors);
    }

    public function test_rejects_missing_title(): void
    {
        $payload = SplashScreen::defaultPayload();
        $payload['title'] = '';

        $errors = SplashScreen::validateValue(json_encode($payload, JSON_UNESCAPED_UNICODE));

        $this->assertNotEmpty($errors);
    }

    public function test_rejects_unsafe_image_url(): void
    {
        $payload = SplashScreen::defaultPayload();
        $payload['image'] = 'javascript:alert(1)';

        $errors = SplashScreen::validateValue(json_encode($payload, JSON_UNESCAPED_UNICODE));

        $this->assertNotEmpty($errors);
    }
}
