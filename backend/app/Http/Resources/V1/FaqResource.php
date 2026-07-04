<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaqResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'question' => $this->question,
            'answer' => $this->answer,
            'category' => $this->category,
            'is_active' => $this->is_active,
            'order' => $this->order,
        ];
    }
}
