<?php

namespace App\Http\Requests\Announcement;

use App\Http\Requests\RichContentAdminRequest;

class UpdateAnnouncementRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:250', 'unique:announcements,slug,'.$this->route('announcement')],
            'content' => ['sometimes', 'string'],
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
