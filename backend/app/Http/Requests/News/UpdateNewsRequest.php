<?php

namespace App\Http\Requests\News;

use App\Http\Requests\RichContentAdminRequest;
use App\Models\News;
use App\Rules\SafeMediaUrl;
use Illuminate\Validation\Rule;

class UpdateNewsRequest extends RichContentAdminRequest
{
    use ValidatesNewsPublishSchedule;

    public function rules(): array
    {
        /** @var News|null $news */
        $news = $this->route('news');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'title' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('news', 'slug')->ignore($news?->id)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'nullable', 'string'],
            'content_json' => ['sometimes', 'nullable', 'array'],
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
