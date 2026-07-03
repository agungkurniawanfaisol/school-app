<?php

namespace App\Http\Requests\StudentActivity;

use App\Http\Requests\AdminFormRequest;
use App\Models\StudentActivity;
use Illuminate\Validation\Rule;

class UpdateStudentActivityRequest extends AdminFormRequest
{
    public function rules(): array
    {
        /** @var StudentActivity|null $activity */
        $activity = $this->route('student_activity');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('student_activities', 'slug')->ignore($activity?->id)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'nullable', 'string'],
            'content_json' => ['sometimes', 'nullable', 'array'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'activity_date' => ['nullable', 'date'],
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
