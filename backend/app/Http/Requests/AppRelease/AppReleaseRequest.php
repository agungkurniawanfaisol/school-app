<?php

namespace App\Http\Requests\AppRelease;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class AppReleaseRequest extends FormRequest
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
        $routeRelease = $this->route('app_release');
        $ignoreId = is_numeric($routeRelease) ? (int) $routeRelease : null;

        return [
            'version' => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:20',
                'regex:/^\d+\.\d+\.\d+$/',
                // Match DB unique(version) — soft-deleted rows still occupy the version.
                Rule::unique('app_releases', 'version')->ignore($ignoreId),
            ],
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:150'],
            'body' => [$isUpdate ? 'sometimes' : 'required', 'string'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'version.regex' => 'Versi harus format semver, contoh 1.0.0.',
            'version.unique' => 'Versi ini sudah ada.',
            'title.required' => 'Judul rilis wajib diisi.',
            'body.required' => 'Catatan rilis wajib diisi.',
        ];
    }
}
