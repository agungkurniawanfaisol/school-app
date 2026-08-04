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
        $yearId = (int) ($this->input('academic_year_id') ?? $existing?->academic_year_id ?? 0);
        $jenjang = (string) ($this->input('jenjang') ?? $existing?->jenjang ?? '');
        $program = (string) ($this->input('program') ?? $existing?->program ?? '');
        $ignoreId = $existing?->id;

        return [
            'school_id' => ['required', 'exists:schools,id'],
            'academic_year_id' => [
                'required',
                'exists:academic_years,id',
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
            'name' => ['required', 'string', 'max:100'],
            'jenjang' => ['required', 'string', Rule::in(PmbFee::JENJANGS)],
            'program' => [
                'required',
                'string',
                Rule::in(PmbFee::PROGRAMS),
                Rule::unique('pmb_fees', 'program')
                    ->where(fn ($query) => $query
                        ->where('school_id', $schoolId)
                        ->where('academic_year_id', $yearId)
                        ->where('jenjang', $jenjang)
                        ->whereNull('deleted_at'))
                    ->ignore($ignoreId),
            ],
            'amount' => ['required', 'integer', 'min:1000', 'max:100000000'],
            'bank_name' => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:50'],
            'account_holder' => ['required', 'string', 'max:150'],
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
            'program.unique' => 'Biaya untuk kombinasi tahun ajaran, jenjang, dan program ini sudah ada.',
            'amount.min' => 'Nominal minimal Rp 1.000.',
            'bank_name.required' => 'Bank transfer wajib diisi.',
            'account_number.required' => 'Nomor rekening wajib diisi.',
            'account_holder.required' => 'Atas nama rekening wajib diisi.',
        ];
    }
}
