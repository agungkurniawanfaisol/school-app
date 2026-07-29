<?php

namespace App\Http\Requests\PmbRegistration;

use App\Models\PmbRegistration;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PmbRegistrationAnalyticsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'nullable', 'string', 'max:200'],
            'status' => ['sometimes', 'nullable', 'string', Rule::in(PmbRegistration::STATUSES)],
            'academic_year' => ['sometimes', 'nullable', 'string', 'max:20'],
            'grade_applied' => ['sometimes', 'nullable', 'string', 'max:50'],
            'school_id' => ['sometimes', 'nullable', 'integer', 'exists:schools,id'],
            'sort_by' => ['sometimes', 'nullable', 'string', Rule::in([
                'student_name',
                'created_at',
                'status',
                'grade_applied',
                'registration_number',
            ])],
            'sort_dir' => ['sometimes', 'nullable', 'string', Rule::in(['asc', 'desc'])],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function filters(): array
    {
        return array_filter(
            $this->validated(),
            static fn (mixed $value): bool => $value !== null && $value !== '',
        );
    }
}
