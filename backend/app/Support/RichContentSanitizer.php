<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class RichContentSanitizer
{
    private const ALLOWED_NODE_TYPES = [
        'doc',
        'paragraph',
        'text',
        'heading',
        'bulletList',
        'orderedList',
        'listItem',
        'blockquote',
        'horizontalRule',
        'hardBreak',
        'code',
        'image',
        'youtube',
        'videoBlock',
        'columns',
        'column',
    ];

    private const ALLOWED_MARK_TYPES = [
        'bold',
        'italic',
        'strike',
        'underline',
        'code',
        'link',
        'subscript',
        'superscript',
        'textStyle',
    ];

    private ?HtmlSanitizer $htmlSanitizer = null;

    public function sanitizeHtml(?string $html): ?string
    {
        if ($html === null) {
            return null;
        }

        $html = trim($html);
        if ($html === '') {
            return $html;
        }

        $sanitized = $this->htmlSanitizer()->sanitize($html);

        return $this->stripUnsafeIframes($sanitized);
    }

    /**
     * @param  array<string, mixed>|null  $document
     * @return array<string, mixed>|null
     */
    public function sanitizeDocument(?array $document): ?array
    {
        if ($document === null) {
            return null;
        }

        if (($document['type'] ?? null) !== 'doc') {
            return ['type' => 'doc', 'content' => []];
        }

        $sanitized = $this->sanitizeNode($document);
        if (! is_array($sanitized)) {
            return ['type' => 'doc', 'content' => []];
        }

        return $sanitized;
    }

    /**
     * @param  array<string, mixed>  $node
     * @return array<string, mixed>|null
     */
    private function sanitizeNode(array $node): ?array
    {
        $type = $node['type'] ?? null;
        if (! is_string($type) || ! in_array($type, self::ALLOWED_NODE_TYPES, true)) {
            return null;
        }

        $sanitized = ['type' => $type];

        if (isset($node['attrs']) && is_array($node['attrs'])) {
            $attrs = $this->sanitizeNodeAttributes($type, $node['attrs']);
            if ($attrs !== []) {
                $sanitized['attrs'] = $attrs;
            }
        }

        if (isset($node['text']) && is_string($node['text'])) {
            $sanitized['text'] = $node['text'];
        }

        if (isset($node['marks']) && is_array($node['marks'])) {
            $marks = $this->sanitizeMarks($node['marks']);
            if ($marks !== []) {
                $sanitized['marks'] = $marks;
            }
        }

        if (isset($node['content']) && is_array($node['content'])) {
            $content = [];
            foreach ($node['content'] as $child) {
                if (! is_array($child)) {
                    continue;
                }

                $sanitizedChild = $this->sanitizeNode($child);
                if ($sanitizedChild !== null) {
                    $content[] = $sanitizedChild;
                }
            }

            if ($content !== []) {
                $sanitized['content'] = $content;
            }
        }

        if ($type === 'image' && ! isset($sanitized['attrs']['src'])) {
            return null;
        }

        if ($type === 'videoBlock' && ! isset($sanitized['attrs']['src'])) {
            return null;
        }

        if ($type === 'youtube' && ! isset($sanitized['attrs']['src'])) {
            return null;
        }

        return $sanitized;
    }

    /**
     * @param  array<string, mixed>  $attrs
     * @return array<string, mixed>
     */
    private function sanitizeNodeAttributes(string $type, array $attrs): array
    {
        return match ($type) {
            'heading' => $this->only($attrs, [
                'level' => fn ($value) => in_array((int) $value, [2, 3], true) ? (int) $value : 2,
                'textAlign' => fn ($value) => $this->sanitizeTextAlign($value),
            ]),
            'paragraph' => $this->only($attrs, [
                'textAlign' => fn ($value) => $this->sanitizeTextAlign($value),
            ]),
            'image' => $this->only($attrs, [
                'src' => fn ($value) => SafeUrl::sanitize(is_string($value) ? $value : null),
                'alt' => fn ($value) => is_string($value) ? mb_substr($value, 0, 500) : null,
                'title' => fn ($value) => is_string($value) ? mb_substr($value, 0, 250) : null,
                'width' => fn ($value) => is_numeric($value) ? (int) $value : null,
                'height' => fn ($value) => is_numeric($value) ? (int) $value : null,
                'align' => fn ($value) => $this->sanitizeImageAlign($value),
            ]),
            'videoBlock' => $this->only($attrs, [
                'src' => fn ($value) => SafeUrl::sanitize(is_string($value) ? $value : null),
                'poster' => fn ($value) => SafeUrl::sanitize(is_string($value) ? $value : null),
            ]),
            'youtube' => $this->only($attrs, [
                'src' => fn ($value) => SafeUrl::isYoutubeEmbed(is_string($value) ? $value : null)
                    ? trim((string) $value)
                    : null,
            ]),
            default => [],
        };
    }

    /**
     * @param  array<int, array<string, mixed>>  $marks
     * @return array<int, array<string, mixed>>
     */
    private function sanitizeMarks(array $marks): array
    {
        $sanitized = [];

        foreach ($marks as $mark) {
            if (! is_array($mark)) {
                continue;
            }

            $type = $mark['type'] ?? null;
            if (! is_string($type) || ! in_array($type, self::ALLOWED_MARK_TYPES, true)) {
                continue;
            }

            $entry = ['type' => $type];

            if ($type === 'link' && isset($mark['attrs']) && is_array($mark['attrs'])) {
                $href = SafeUrl::sanitize(isset($mark['attrs']['href']) && is_string($mark['attrs']['href'])
                    ? $mark['attrs']['href']
                    : null);

                if ($href === null) {
                    continue;
                }

                $entry['attrs'] = [
                    'href' => $href,
                    'target' => ($mark['attrs']['target'] ?? null) === '_blank' ? '_blank' : null,
                    'rel' => ($mark['attrs']['target'] ?? null) === '_blank' ? 'noopener noreferrer' : null,
                ];
            }

            if ($type === 'textStyle' && isset($mark['attrs']) && is_array($mark['attrs'])) {
                $color = $mark['attrs']['color'] ?? null;
                if (is_string($color) && preg_match('/^#(?:[0-9a-fA-F]{3}){1,2}$/', $color)) {
                    $entry['attrs'] = ['color' => $color];
                }
            }

            $sanitized[] = array_filter($entry, fn ($value) => $value !== null);
        }

        return $sanitized;
    }

    /**
     * @param  array<string, mixed>  $attrs
     * @param  array<string, callable>  $rules
     * @return array<string, mixed>
     */
    private function only(array $attrs, array $rules): array
    {
        $sanitized = [];

        foreach ($rules as $key => $rule) {
            if (! array_key_exists($key, $attrs)) {
                continue;
            }

            $value = $rule($attrs[$key]);
            if ($value !== null && $value !== '') {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    private function sanitizeTextAlign(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        return in_array($value, ['left', 'center', 'right', 'justify'], true) ? $value : null;
    }

    private function sanitizeImageAlign(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        return in_array($value, ['left', 'center', 'right'], true) ? $value : null;
    }

    private function htmlSanitizer(): HtmlSanitizer
    {
        if ($this->htmlSanitizer !== null) {
            return $this->htmlSanitizer;
        }

        $config = (new HtmlSanitizerConfig())
            ->allowSafeElements()
            ->allowElement('div', ['class', 'data-column', 'data-columns', 'data-align', 'data-video-block', 'data-youtube-video'])
            ->allowElement('iframe', ['src', 'width', 'height', 'class', 'allow', 'allowfullscreen', 'frameborder'])
            ->allowElement('video', ['src', 'poster', 'controls', 'class', 'data-video-block'])
            ->allowElement('img', ['src', 'alt', 'title', 'class', 'width', 'height', 'data-align'])
            ->allowElement('span', ['style', 'class'])
            ->allowRelativeLinks(true)
            ->allowRelativeMedias(true)
            ->allowLinkSchemes(['http', 'https', 'mailto'])
            ->allowMediaSchemes(['http', 'https'])
            ->withMaxInputLength(500_000);

        $this->htmlSanitizer = new HtmlSanitizer($config);

        return $this->htmlSanitizer;
    }

    private function stripUnsafeIframes(string $html): string
    {
        return (string) preg_replace_callback(
            '/<iframe\b[^>]*\bsrc=(["\'])(.*?)\1[^>]*>.*?<\/iframe>/is',
            static function (array $matches): string {
                return SafeUrl::isYoutubeEmbed($matches[2]) ? $matches[0] : '';
            },
            $html,
        );
    }
}
