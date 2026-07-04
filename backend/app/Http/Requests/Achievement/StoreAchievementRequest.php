<?php

namespace App\Http\Requests\Achievement;

use App\Http\Requests\RichContentAdminRequest;
use App\Rules\SafeMediaUrl;

class StoreAchievementRequest extends RichContentAdminRequest
{
    public function rules(): array
    {
        return [
            'school_id' => ['required', 'exists:schools,id'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'category' => ['sometimes', 'string', 'in:akademik,olahraga,seni,keagamaan,lainnya'],
            'level' => ['sometimes', 'string', 'in:sekolah,kecamatan,kota,provinsi,nasional,internasional'],
            'student_name' => ['nullable', 'string', 'max:200'],
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'image' => ['nullable', 'string', 'max:500', new SafeMediaUrl],
            'is_active' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
