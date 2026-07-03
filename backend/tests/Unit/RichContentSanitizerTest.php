<?php

namespace Tests\Unit;

use App\Support\RichContentSanitizer;
use App\Support\SafeUrl;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RichContentSanitizerTest extends TestCase
{
    private RichContentSanitizer $sanitizer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->sanitizer = new RichContentSanitizer;
    }

    #[Test]
    public function it_strips_script_tags_from_html(): void
    {
        $html = '<p>Hello</p><script>alert(1)</script>';

        $this->assertSame('<p>Hello</p>', $this->sanitizer->sanitizeHtml($html));
    }

    #[Test]
    public function it_removes_javascript_links_from_document(): void
    {
        $document = [
            'type' => 'doc',
            'content' => [
                [
                    'type' => 'paragraph',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => 'Click me',
                            'marks' => [
                                [
                                    'type' => 'link',
                                    'attrs' => ['href' => 'javascript:alert(1)'],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $sanitized = $this->sanitizer->sanitizeDocument($document);

        $this->assertSame('Click me', $sanitized['content'][0]['content'][0]['text']);
        $this->assertArrayNotHasKey('marks', $sanitized['content'][0]['content'][0]);
    }

    #[Test]
    public function it_keeps_safe_image_src_in_document(): void
    {
        $document = [
            'type' => 'doc',
            'content' => [
                [
                    'type' => 'image',
                    'attrs' => [
                        'src' => '/storage/uploads/news/sample.png',
                        'align' => 'center',
                    ],
                ],
            ],
        ];

        $sanitized = $this->sanitizer->sanitizeDocument($document);

        $this->assertSame('/storage/uploads/news/sample.png', $sanitized['content'][0]['attrs']['src']);
        $this->assertSame('center', $sanitized['content'][0]['attrs']['align']);
    }

    #[Test]
    public function safe_url_rejects_javascript_scheme(): void
    {
        $this->assertFalse(SafeUrl::isAllowed('javascript:alert(1)'));
        $this->assertNull(SafeUrl::sanitize('javascript:alert(1)'));
    }
}
