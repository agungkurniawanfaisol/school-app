<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PmbRegistrationStatsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array<string, mixed> $stats */
        $stats = $this->resource;

        return [
            'totals' => $stats['totals'],
            'by_grade' => $stats['by_grade'],
            'by_gender' => $stats['by_gender'],
            'by_month' => $stats['by_month'],
            'top_previous_schools' => $stats['top_previous_schools'],
        ];
    }
}
