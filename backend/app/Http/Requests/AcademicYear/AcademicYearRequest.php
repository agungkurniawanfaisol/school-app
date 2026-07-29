<?php

namespace App\Http\Requests\AcademicYear;

use App\Models\AcademicYear;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class AcademicYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    protected function sharedRules(): array
    {
        $routeYear = $this->route('academic_year');
        $existing = $routeYear instanceof AcademicYear
            ? $routeYear
            : (is_numeric($routeYear) ? AcademicYear::query()->find((int) $routeYear) : null);

        $schoolId = (int) ($this->input('school_id') ?? $existing?->school_id ?? 0);
        $ignoreId = $existing?->id;

        return [
            'school_id' => ['required', 'exists:schools,id'],
            'label' => [
                'required',
                'string',
                'max:20',
                'regex:/^\d{4}\/\d{4}$/',
                Rule::unique('academic_years', 'label')
                    ->where(fn ($query) => $query->where('school_id', $schoolId))
                    ->ignore($ignoreId),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! is_string($value) || ! preg_match('/^(\d{4})\/(\d{4})$/', $value, $matches)) {
                        return;
                    }

                    if ((int) $matches[2] !== (int) $matches[1] + 1) {
                        $fail('Format tahun ajaran tidak valid. Tahun kedua harus tahun pertama + 1.');
                    }
                },
            ],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'label.regex' => 'Format tahun ajaran harus YYYY/YYYY (contoh: 2026/2027).',
            'label.unique' => 'Tahun ajaran ini sudah ada untuk sekolah tersebut.',
        ];
    }
}
