<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacilityPhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'facility_id' => $this->facility_id,
            'path' => $this->path,
            'url' => $this->resolveUrl(),
            'caption' => $this->caption,
            'order' => $this->order,
            'is_active' => $this->is_active,
        ];
    }

    private function resolveUrl(): ?string
    {
        if (! $this->path) {
            return null;
        }

        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://') || str_starts_with($this->path, '/')) {
            return $this->path;
        }

        return asset('storage/'.$this->path);
    }
}
