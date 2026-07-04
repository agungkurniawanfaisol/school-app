<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'file_url' => $this->file_url,
            'file_size' => $this->file_size,
            'file_type' => $this->file_type,
            'download_count' => $this->download_count,
            'is_active' => $this->is_active,
            'order' => $this->order,
        ];
    }
}
