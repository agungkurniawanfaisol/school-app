<?php

namespace App\Http\Requests\Gmail;

use App\Http\Requests\AdminFormRequest;

class SendGmailTestRequest extends AdminFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'to' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string', 'max:10000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'to' => 'alamat email',
            'subject' => 'subjek',
            'body' => 'isi email',
        ];
    }

    public function messages(): array
    {
        return $this->commonMessages();
    }
}
