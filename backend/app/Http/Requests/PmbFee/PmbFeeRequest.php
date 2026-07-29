<?php

namespace App\Http\Requests\PmbFee;

use App\Models\AcademicYear;
use App\Models\PmbFee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class PmbFeeRequest extends FormRequest
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
        $routeFee = $this->route('pmb_fee');
        $existing = $routeFee instanceof PmbFee
            ? $routeFee
            : (is_numeric($routeFee) ? PmbFee::query()->find((int) $routeFee) : null);

        $schoolId = (int) ($this->input('school_id') ?? $existing?->school_id ?? 0);
        $ignoreId = $existing?->id;

        return [
            'school_id' => ['required', 'exists:schools,id'],
            'academic_year_id' => [
                'required',
                'exists:academic_years,id',
                Rule::unique('pmb_fees', 'academic_year_id')
                    ->where(fn ($query) => $query->where('school_id', $schoolId)->whereNull('deleted_at'))
                    ->ignore($ignoreId),
                function (string $attribute, mixed $value, \Closure $fail) use ($schoolId): void {
                    if (! is_numeric($value)) {
                        return;
                    }

                    $year = AcademicYear::query()->find((int) $value);
                    if ($year === null) {
                        return;
                    }

                    if ((int) $year->school_id !== $schoolId) {
                        $fail('Tahun ajaran tidak sesuai dengan sekolah yang dipilih.');
                    }
                },
            ],
            'amount' => ['required', 'integer', 'min:1000', 'max:100000000'],
            'notes' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'academic_year_id.unique' => 'Biaya untuk tahun ajaran ini sudah ada.',
            'amount.min' => 'Nominal minimal Rp 1.000.',
        ];
    }
}
