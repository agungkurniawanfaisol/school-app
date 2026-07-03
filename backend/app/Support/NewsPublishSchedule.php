<?php

namespace App\Support;

use App\Models\News;
use Carbon\CarbonInterface;

class NewsPublishSchedule
{
    public const DISPLAY_DRAFT = 'draft';

    public const DISPLAY_SCHEDULED = 'scheduled';

    public const DISPLAY_LIVE = 'live';

    public const DISPLAY_ENDED = 'ended';

    public const DISPLAY_ARCHIVED = 'archived';

    public static function resolveDisplayStatus(News $news, ?CarbonInterface $now = null): string
    {
        $now ??= now();

        if ($news->status === 'archived') {
            return self::DISPLAY_ARCHIVED;
        }

        if ($news->status !== 'published') {
            return self::DISPLAY_DRAFT;
        }

        if ($news->published_at === null) {
            return self::DISPLAY_DRAFT;
        }

        if ($news->published_at->gt($now)) {
            return self::DISPLAY_SCHEDULED;
        }

        if ($news->publish_ends_at !== null && $news->publish_ends_at->lte($now)) {
            return self::DISPLAY_ENDED;
        }

        return self::DISPLAY_LIVE;
    }

    public static function isPubliclyVisible(News $news, ?CarbonInterface $now = null): bool
    {
        $now ??= now();

        if (! $news->is_active || $news->status !== 'published') {
            return false;
        }

        if ($news->published_at === null || $news->published_at->gt($now)) {
            return false;
        }

        if ($news->publish_ends_at !== null && $news->publish_ends_at->lte($now)) {
            return false;
        }

        return true;
    }
}
