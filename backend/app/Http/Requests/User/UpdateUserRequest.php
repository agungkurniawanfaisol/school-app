<?php

namespace App\Http\Requests\User;

use App\Http\Requests\AdminFormRequest;
use App\Models\User;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends AdminFormRequest
{
    public function rules(): array
    {
        $id = $this->route('user');

        return [
            'name' => ['sometimes', 'string', 'max:200'],
            'email' => ['sometimes', 'email', 'max:150', Rule::unique('users', 'email')->ignore($id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['sometimes', 'string', Rule::in([User::ROLE_ADMIN, User::ROLE_GURU])],
            'is_active' => ['sometimes', 'boolean'],
            'teacher_id' => [
                'nullable',
                'integer',
                'exists:teachers,id',
                Rule::unique('users', 'teacher_id')->ignore($id),
            ],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
