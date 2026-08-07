<?php

namespace App\Http\Requests\PmbProgram;

use App\Models\PmbProgram;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class PmbProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    protected function sharedRules(bool $isUpdate = false): array
    {
        $routeProgram = $this->route('pmb_program');
        $existing = $routeProgram instanceof PmbProgram
            ? $routeProgram
            : (is_numeric($routeProgram) ? PmbProgram::query()->find((int) $routeProgram) : null);

        $schoolId = (int) ($this->input('school_id') ?? $existing?->school_id ?? 0);
        $ignoreId = $existing?->id;

        $rules = [
            'school_id' => ['required', 'exists:schools,id'],
            'name' => ['required', 'string', 'max:100'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['sometimes', 'boolean'],
        ];

        if ($isUpdate) {
            $rules['code'] = ['sometimes', 'string', 'max:30'];
        } else {
            $rules['code'] = [
                'required',
                'string',
                'max:30',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('pmb_programs', 'code')
                    ->where(fn ($query) => $query
                        ->where('school_id', $schoolId)
                        ->whereNull('deleted_at'))
                    ->ignore($ignoreId),
            ];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.regex' => 'Kode program hanya huruf kecil, angka, dan tanda hubung.',
            'code.unique' => 'Kode program sudah dipakai di sekolah ini.',
            'name.required' => 'Nama program wajib diisi.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('code') && is_string($this->input('code'))) {
            $this->merge(['code' => strtolower(trim($this->input('code')))]);
        }
    }
}
