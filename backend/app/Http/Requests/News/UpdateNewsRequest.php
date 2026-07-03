<?php

namespace App\Http\Requests\News;

use App\Http\Requests\AdminFormRequest;
use App\Models\News;
use Illuminate\Validation\Rule;

class UpdateNewsRequest extends AdminFormRequest
{
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
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('content_json') && is_string($this->content_json)) {
            $this->merge([
                'content_json' => json_decode($this->content_json, true),
            ]);
        }
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
