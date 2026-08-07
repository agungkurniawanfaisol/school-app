<?php

namespace App\Http\Requests\Announcement;

use App\Http\Requests\RichContentAdminRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateAnnouncementRequest extends RichContentAdminRequest
{
    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        // slug column is NOT NULL — omit null so existing slug is preserved.
        if ($this->exists('slug') && blank($this->input('slug'))) {
            $this->request->remove('slug');
            $this->offsetUnset('slug');
        }
    }

    public function rules(): array
    {
        $announcementId = $this->route('announcement');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:200'],
            'slug' => [
                'sometimes',
                'string',
                'max:250',
                Rule::unique('announcements', 'slug')->ignore($announcementId),
            ],
            'content' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'string', 'in:normal,important,urgent'],
            'is_pinned' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:published_at'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_url' => [
                'nullable',
                'string',
                'max:500',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! is_string($value) || $value === '') {
                        return;
                    }
                    if (str_starts_with($value, '/') && ! str_starts_with($value, '//')) {
                        return;
                    }
                    if (filter_var($value, FILTER_VALIDATE_URL) && preg_match('#^https?://#i', $value)) {
                        return;
                    }
                    $fail('URL tombol aksi harus path relatif (contoh /pmb/daftar) atau URL http(s).');
                },
            ],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
