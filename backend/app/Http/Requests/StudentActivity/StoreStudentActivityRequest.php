<?php

namespace App\Http\Requests\StudentActivity;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class StoreStudentActivityRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'title' => ['required', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', 'unique:student_activities,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string', 'required_without:content_json'],
            'content_json' => ['nullable', 'array', 'required_without:content'],
            'thumbnail' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'activity_date' => ['nullable', 'date'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'photos' => ['sometimes', 'array', 'max:24'],
            'photos.*.id' => ['sometimes', 'integer', 'exists:student_activity_photos,id'],
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
