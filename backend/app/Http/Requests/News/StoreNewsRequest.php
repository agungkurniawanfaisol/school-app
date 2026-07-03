<?php

namespace App\Http\Requests\News;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class StoreNewsRequest extends RichContentAdminRequest
{
    use ValidatesNewsPublishSchedule;

    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'title' => ['required', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', 'unique:news,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string', 'required_without:content_json'],
            'content_json' => ['nullable', 'array', 'required_without:content'],
            'thumbnail' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'publish_ends_at' => ['nullable', 'date', 'after:published_at'],
        ];
    }

    public function messages(): array
    {
        return array_merge($this->commonMessages(), [
            'publish_ends_at.after' => 'Waktu berakhir harus setelah waktu mulai.',
        ]);
    }
}
