<?php

namespace App\Http\Resources\V1;

use App\Support\Rupiah;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PmbFeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'academic_year_id' => $this->academic_year_id,
            'academic_year' => $this->whenLoaded('academicYear', fn () => $this->academicYear ? [
                'id' => $this->academicYear->id,
                'uuid' => $this->academicYear->uuid,
                'label' => $this->academicYear->label,
                'is_active' => $this->academicYear->is_active,
            ] : null),
            'name' => $this->name,
            'jenjang' => $this->jenjang,
            'pmb_program_id' => $this->pmb_program_id,
            'program' => $this->program,
            'program_name' => $this->programName(),
            'amount' => (int) $this->amount,
            'amount_formatted' => Rupiah::format((int) $this->amount),
            'bank_name' => $this->bank_name,
            'account_number' => $this->account_number,
            'account_holder' => $this->account_holder,
            'notes' => $this->notes,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
