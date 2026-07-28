<?php

namespace App\Support;

final class SettingValueValidator
{
    /**
     * @return list<string>
     */
    public static function errors(?string $key, ?string $value): array
    {
        return match ($key) {
            'hero_collage' => HeroCollage::validateValue($value),
            'splash_screen' => SplashScreen::validateValue($value),
            default => [],
        };
    }
}
