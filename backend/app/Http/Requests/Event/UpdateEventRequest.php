<?php

namespace App\Http\Requests\Event;

use App\Http\Requests\RichContentAdminRequest;

class UpdateEventRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'exists:schools,id'],
            'title' => ['sometimes', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:200'],
            'event_date' => ['sometimes', 'date'],
            'event_end_date' => ['nullable', 'date', 'after_or_equal:event_date'],
            'event_time' => ['nullable', 'string', 'max:20'],
            'category' => ['sometimes', 'string', 'in:akademik,keagamaan,olahraga,umum'],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
