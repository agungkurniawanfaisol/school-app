<?php

namespace App\Http\Requests\News;

use App\Http\Requests\AdminFormRequest;

class PublishNewsRequest extends AdminFormRequest
{
    use ValidatesNewsPublishSchedule;

    public function rules(): array
    {
        return [
            'published_at' => ['required', 'date'],
            'publish_ends_at' => ['nullable', 'date', 'after:published_at'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('published_at') || $this->input('published_at') === null) {
            $this->merge(['published_at' => now()->toDateTimeString()]);
        }
    }

    public function messages(): array
    {
        return array_merge($this->commonMessages(), [
            'published_at.required' => 'Waktu mulai wajib diisi.',
            'publish_ends_at.after' => 'Waktu berakhir harus setelah waktu mulai.',
        ]);
    }
}
