<?php

namespace App\Http\Requests\VirtualTour;

use App\Http\Requests\AdminFormRequest;
use Illuminate\Validation\Rule;

class StoreVirtualTourRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return array_merge($this->tourRules(), [
            'school_id' => ['required', 'exists:schools,id'],
            'slug' => ['nullable', 'string', 'max:270', Rule::unique('virtual_tours', 'slug')],
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    protected function tourRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:250'],
            'description' => ['nullable', 'string', 'max:5000'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
            'start_scene_uuid' => ['nullable', 'uuid'],
            'scenes' => ['sometimes', 'array'],
            'scenes.*.uuid' => ['nullable', 'uuid'],
            'scenes.*.title' => ['required_with:scenes', 'string', 'max:250'],
            'scenes.*.image' => ['required_with:scenes', 'string', 'max:500'],
            'scenes.*.initial_pitch' => ['sometimes', 'numeric', 'between:-90,90'],
            'scenes.*.initial_yaw' => ['sometimes', 'numeric', 'between:-180,180'],
            'scenes.*.order' => ['sometimes', 'integer', 'min:0'],
            'scenes.*.hotspots' => ['sometimes', 'array'],
            'scenes.*.hotspots.*.target_scene_uuid' => ['required_with:scenes.*.hotspots', 'uuid'],
            'scenes.*.hotspots.*.label' => ['required_with:scenes.*.hotspots', 'string', 'max:150'],
            'scenes.*.hotspots.*.pitch' => ['required_with:scenes.*.hotspots', 'numeric', 'between:-90,90'],
            'scenes.*.hotspots.*.yaw' => ['required_with:scenes.*.hotspots', 'numeric', 'between:-180,180'],
            'scenes.*.hotspots.*.order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
