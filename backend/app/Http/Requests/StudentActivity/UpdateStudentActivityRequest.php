<?php

namespace App\Http\Requests\StudentActivity;

use App\Http\Requests\RichContentAdminRequest;
use App\Models\StudentActivity;
use App\Rules\SafeMediaUrl;
use Illuminate\Validation\Rule;

class UpdateStudentActivityRequest extends RichContentAdminRequest
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
            'thumbnail' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'activity_date' => ['nullable', 'date'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'photos' => ['sometimes', 'array', 'max:24'],
            'photos.*.id' => [
                'sometimes',
                'integer',
                Rule::exists('student_activity_photos', 'id')->where(
                    fn ($query) => $query->where('student_activity_id', $activity?->id),
                ),
            ],
            'photos.*.path' => ['required_with:photos', 'string', 'max:500', new SafeMediaUrl],
            'photos.*.caption' => ['nullable', 'string', 'max:250'],
            'photos.*.order' => ['sometimes', 'integer', 'min:0'],
            'photos.*.is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
