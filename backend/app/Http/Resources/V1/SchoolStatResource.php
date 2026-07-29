<?php

namespace App\Http\Resources\V1;

use App\Http\Resources\Concerns\ExposesRichContent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolStatResource extends JsonResource
{
    use ExposesRichContent;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->when($this->isAdminRequest($request), $this->id),
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'icon' => $this->icon,
            'label' => $this->label,
            'value' => $this->value,
            'order' => $this->order,
            'is_active' => $this->is_active,
        ];
    }
}
