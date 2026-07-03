<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Database\Factories\FacilityPhotoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FacilityPhoto extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;
    /** @use HasFactory<FacilityPhotoFactory> */

    protected $fillable = [
        'facility_id',
        'path',
        'caption',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
}
