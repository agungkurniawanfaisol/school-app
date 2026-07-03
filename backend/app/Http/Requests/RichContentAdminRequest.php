<?php

namespace App\Http\Requests;

use App\Support\RichContentSanitizer;
use App\Support\SafeUrl;

abstract class RichContentAdminRequest extends AdminFormRequest
{
    protected function prepareForValidation(): void
    {
        $this->decodeContentJsonString();
        $this->sanitizeRichContentFields();
        $this->sanitizeKnownMediaUrlFields();
    }

    protected function decodeContentJsonString(): void
    {
        if ($this->has('content_json') && is_string($this->content_json)) {
            $decoded = json_decode($this->content_json, true);
            $this->merge([
                'content_json' => is_array($decoded) ? $decoded : null,
            ]);
        }
    }

    protected function sanitizeRichContentFields(): void
    {
        /** @var RichContentSanitizer $sanitizer */
        $sanitizer = app(RichContentSanitizer::class);

        if ($this->has('content') && is_string($this->content)) {
            $this->merge(['content' => $sanitizer->sanitizeHtml($this->content)]);
        }

        if ($this->has('content_json') && is_array($this->input('content_json'))) {
            $this->merge(['content_json' => $sanitizer->sanitizeDocument($this->input('content_json'))]);
        }
    }

    protected function sanitizeKnownMediaUrlFields(): void
    {
        foreach (['thumbnail', 'photo', 'image', 'poster', 'video_url'] as $field) {
            if (! $this->has($field) || ! is_string($this->input($field))) {
                continue;
            }

            $this->merge([$field => SafeUrl::sanitize($this->input($field))]);
        }

        if ($this->has('photos') && is_array($this->input('photos'))) {
            $photos = collect($this->input('photos'))
                ->map(function ($photo) {
                    if (! is_array($photo) || ! isset($photo['path']) || ! is_string($photo['path'])) {
                        return $photo;
                    }

                    $photo['path'] = SafeUrl::sanitize($photo['path']);

                    return $photo;
                })
                ->all();

            $this->merge(['photos' => $photos]);
        }

        if ($this->has('social_media') && is_array($this->input('social_media'))) {
            $socialMedia = [];

            foreach ($this->input('social_media') as $key => $url) {
                if (! is_string($url)) {
                    continue;
                }

                $socialMedia[$key] = SafeUrl::sanitize($url);
            }

            $this->merge(['social_media' => $socialMedia]);
        }
    }
}
