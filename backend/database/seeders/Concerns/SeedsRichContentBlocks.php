<?php

namespace Database\Seeders\Concerns;

trait SeedsRichContentBlocks
{
    protected const IMG_CAMPUS = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80';

    protected const IMG_CLASSROOM = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80';

    protected const IMG_STUDENTS = 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80';

    protected const IMG_GRADUATION = 'https://images.unsplash.com/photo-1541339907198-e08756dedf6f?w=1200&q=80';

    protected const IMG_QURAN = 'https://images.unsplash.com/photo-1609599006353-e6aa9f3f5b4a?w=1200&q=80';

    protected const IMG_WORKSHOP = 'https://images.unsplash.com/photo-1577896851231-70ef94081756?w=1200&q=80';

    protected const IMG_EXCURSION = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80';

    protected const IMG_MUSEUM = 'https://images.unsplash.com/photo-1566127444979-b3d2b654deb2?w=1200&q=80';

    protected const IMG_CHARITY = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80';

    protected const IMG_SCOUTING = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80';

    protected const IMG_MUSIC = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80';

    protected const IMG_SCIENCE = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80';

    protected const VIDEO_SAMPLE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

    /**
     * @param  array<int, array<string, mixed>>  $blocks
     * @return array<string, mixed>
     */
    protected function doc(array $blocks): array
    {
        return ['type' => 'doc', 'content' => $blocks];
    }

    /**
     * @param  array<int, array<string, mixed>>  $nodes
     * @return array<string, mixed>
     */
    protected function p(array $nodes, ?string $align = null): array
    {
        $block = ['type' => 'paragraph', 'content' => $nodes];

        if ($align !== null) {
            $block['attrs'] = ['textAlign' => $align];
        }

        return $block;
    }

    protected function t(string $text): array
    {
        return ['type' => 'text', 'text' => $text];
    }

    protected function bold(string $text): array
    {
        return ['type' => 'text', 'text' => $text, 'marks' => [['type' => 'bold']]];
    }

    protected function italic(string $text): array
    {
        return ['type' => 'text', 'text' => $text, 'marks' => [['type' => 'italic']]];
    }

    protected function link(string $text, string $href): array
    {
        return [
            'type' => 'text',
            'text' => $text,
            'marks' => [['type' => 'link', 'attrs' => ['href' => $href, 'target' => '_blank']]],
        ];
    }

    protected function h2(string $text): array
    {
        return [
            'type' => 'heading',
            'attrs' => ['level' => 2],
            'content' => [$this->t($text)],
        ];
    }

    protected function h3(string $text): array
    {
        return [
            'type' => 'heading',
            'attrs' => ['level' => 3],
            'content' => [$this->t($text)],
        ];
    }

    protected function img(string $src, string $alt, string $align = 'center'): array
    {
        return [
            'type' => 'image',
            'attrs' => [
                'src' => $src,
                'alt' => $alt,
                'align' => $align,
            ],
        ];
    }

    protected function yt(string $videoId): array
    {
        return [
            'type' => 'youtube',
            'attrs' => ['src' => "https://www.youtube-nocookie.com/embed/{$videoId}"],
        ];
    }

    protected function video(string $src, ?string $poster = null): array
    {
        $attrs = ['src' => $src];
        if ($poster !== null) {
            $attrs['poster'] = $poster;
        }

        return ['type' => 'videoBlock', 'attrs' => $attrs];
    }

    /**
     * @param  array<int, string|array<int, array<string, mixed>>>  $items
     * @return array<string, mixed>
     */
    protected function ol(array $items): array
    {
        return [
            'type' => 'orderedList',
            'content' => array_map(function ($item) {
                $nodes = is_string($item) ? [$this->t($item)] : $item;

                return [
                    'type' => 'listItem',
                    'content' => [$this->p($nodes)],
                ];
            }, $items),
        ];
    }

    /**
     * @param  array<int, string>  $items
     * @return array<string, mixed>
     */
    protected function ul(array $items): array
    {
        return [
            'type' => 'bulletList',
            'content' => array_map(fn (string $item) => [
                'type' => 'listItem',
                'content' => [$this->p([$this->t($item)])],
            ], $items),
        ];
    }

    protected function blockquote(string $text): array
    {
        return [
            'type' => 'blockquote',
            'content' => [$this->p([$this->t($text)])],
        ];
    }

    protected function hr(): array
    {
        return ['type' => 'horizontalRule'];
    }

    /**
     * @param  array<int, array<int, array<string, mixed>>>  $columns
     * @return array<string, mixed>
     */
    protected function cols(array $columns): array
    {
        return [
            'type' => 'columns',
            'content' => array_map(fn (array $blocks) => [
                'type' => 'column',
                'content' => $blocks,
            ], $columns),
        ];
    }

    /**
     * @param  array<int, string|array<int, array<string, mixed>>>  $olItems
     * @return array{content: null, content_json: array<string, mixed>, thumbnail: string}
     */
    protected function genericRichStoryProfile(
        string $heading,
        string $intro,
        string $thumbnail,
        array $olItems,
        string $youtubeId = 'k5u1P9lZ-p4',
    ): array {
        return [
            'content' => null,
            'thumbnail' => $thumbnail,
            'content_json' => $this->doc([
                $this->h2($heading),
                $this->p([$this->t($intro)]),
                $this->img($thumbnail, $heading, 'center'),
                $this->h3('Sorotan Utama'),
                $this->ol($olItems),
                $this->cols([
                    [
                        $this->img(self::IMG_STUDENTS, 'Suasana kegiatan siswa', 'center'),
                    ],
                    [
                        $this->img(self::IMG_CLASSROOM, 'Pembelajaran interaktif', 'center'),
                    ],
                ]),
                $this->h3('Dokumentasi'),
                $this->yt($youtubeId),
                $this->video(self::VIDEO_SAMPLE, $thumbnail),
                $this->blockquote("“{$heading}” — Tim Humas Nurul Hikmah"),
            ]),
        ];
    }
}
