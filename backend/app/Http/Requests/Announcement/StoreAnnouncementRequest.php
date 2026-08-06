<?php

namespace App\Http\Requests\Announcement;

use App\Http\Requests\RichContentAdminRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreAnnouncementRequest extends RichContentAdminRequest
{
    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        if (blank($this->input('slug')) && filled($this->input('title'))) {
            $this->merge([
                'slug' => Str::slug((string) $this->input('title')) ?: 'pengumuman-'.Str::lower(Str::random(8)),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:250', Rule::unique('announcements', 'slug')],
            'content' => ['required', 'string'],
            'priority' => ['sometimes', 'string', 'in:normal,important,urgent'],
            'is_pinned' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:published_at'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_url' => ['nullable', 'string', 'max:500', 'url'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
