<?php

namespace App\Http\Requests\User;

use App\Http\Requests\AdminFormRequest;
use App\Models\User;
use Illuminate\Validation\Rule;

class StoreUserRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:200'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in([User::ROLE_ADMIN, User::ROLE_GURU])],
            'is_active' => ['sometimes', 'boolean'],
            'teacher_id' => [
                'nullable',
                'integer',
                'exists:teachers,id',
                Rule::unique('users', 'teacher_id'),
            ],
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
