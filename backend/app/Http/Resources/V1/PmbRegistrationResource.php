<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PmbRegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'registration_number' => $this->registration_number,
            'student_name' => $this->student_name,
            'birth_place' => $this->birth_place,
            'birth_date' => $this->birth_date?->toDateString(),
            'gender' => $this->gender,
            'parent_name' => $this->parent_name,
            'parent_phone' => $this->parent_phone,
            'parent_email' => $this->parent_email,
            'address' => $this->address,
            'previous_school' => $this->previous_school,
            'grade_applied' => $this->grade_applied,
            'status' => $this->status,
            'notes' => $this->when($request->routeIs('admin.*'), $this->notes),
            'payment_info' => $this->when($request->routeIs('admin.*'), $this->payment_info),
            'documents' => PmbDocumentResource::collection($this->whenLoaded('documents')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
