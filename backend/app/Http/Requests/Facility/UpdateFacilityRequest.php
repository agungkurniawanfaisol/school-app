<?php

namespace App\Http\Requests\Facility;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Rule;

class UpdateFacilityRequest extends AdminFormRequest
{
    public function rules(): array
    {
        /** @var \App\Models\Facility|null $facility */
        $facility = $this->route('facility');

        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'name' => ['sometimes', 'string', 'max:250'],
            'slug' => ['sometimes', 'string', 'max:270', Rule::unique('facilities', 'slug')->ignore($facility?->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'content_json' => ['nullable', 'array'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'category' => ['nullable', 'string', 'max:100'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'photos' => ['sometimes', 'array'],
            'photos.*.id' => ['sometimes', 'integer', 'exists:facility_photos,id'],
            'photos.*.path' => ['required_with:photos', 'string', 'max:500'],
            'photos.*.caption' => ['nullable', 'string', 'max:250'],
            'photos.*.order' => ['sometimes', 'integer', 'min:0'],
            'photos.*.is_active' => ['sometimes', 'boolean'],
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
