<?php

namespace App\Http\Requests\PmbRegistration;

use App\Rules\OwnedPmbMedia;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PortalDraftPmbRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'school_id' => ['sometimes', 'required', 'exists:schools,id'],
            'current_step' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'student_name' => ['nullable', 'string', 'max:200'],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:L,P'],
            'parent_name' => ['nullable', 'string', 'max:200'],
            'parent_phone' => ['nullable', 'string', 'max:30'],
            'parent_email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string', 'max:500'],
            'previous_school' => ['nullable', 'string', 'max:250'],
            'grade_applied' => ['nullable', 'string', 'max:50'],
            'draft_payload' => ['nullable', 'array'],
            'draft_payload.nickname' => ['nullable', 'string', 'max:100'],
            'draft_payload.contact_phone' => ['nullable', 'string', 'max:20'],
            'draft_payload.relationship_to_child' => [
                'nullable',
                'string',
                'max:50',
                Rule::in(['Anak kandung', 'Anak tiri', 'Lainnya']),
            ],
            'draft_payload.relationship_to_child_other' => [
                'nullable',
                'string',
                'max:100',
                'required_if:draft_payload.relationship_to_child,Lainnya',
            ],
            'draft_payload.child_order' => ['nullable', 'string', 'max:10'],
            'draft_payload.sibling_count' => ['nullable', 'string', 'max:10'],
            'draft_payload.academic_year' => ['nullable', 'string', 'max:20'],
            'draft_payload.father_name' => ['nullable', 'string', 'max:200'],
            'draft_payload.mother_name' => ['nullable', 'string', 'max:200'],
            'draft_payload.father_phone' => ['nullable', 'string', 'max:20'],
            'draft_payload.mother_phone' => ['nullable', 'string', 'max:20'],
            'draft_payload.email_secondary' => ['nullable', 'email', 'max:150'],
            'draft_payload.transfer_confirmed' => ['nullable', 'boolean'],
            'draft_payload.student_photo_media_id' => [
                'nullable',
                'integer',
                OwnedPmbMedia::imageOnly($this->user()?->id),
            ],
            'draft_payload.address_rt' => ['nullable', 'string', 'max:3', 'regex:/^\d{0,3}$/'],
            'draft_payload.address_rw' => ['nullable', 'string', 'max:3', 'regex:/^\d{0,3}$/'],
            'draft_payload.kabupaten' => ['nullable', 'string', 'max:100'],
            'draft_payload.provinsi' => ['nullable', 'string', 'max:100'],
            'payment_info' => ['nullable', 'array'],
            'payment_info.bank_name' => ['nullable', 'string', 'max:100'],
            'payment_info.account_name' => ['nullable', 'string', 'max:150'],
            'payment_info.amount' => ['nullable', 'string', 'max:50'],
            'payment_info.transferred_at' => ['nullable', 'date'],
            'payment_info.proof_media_id' => [
                'nullable',
                'integer',
                OwnedPmbMedia::imageOrPdf($this->user()?->id),
            ],
            'payment_info.note' => ['nullable', 'string', 'max:500'],
        ];
    }
}
