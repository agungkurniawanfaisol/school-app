<?php

namespace App\Models;

use App\Traits\HasUuid;
use Database\Factories\VirtualTourSceneFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VirtualTourScene extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    /** @use HasFactory<VirtualTourSceneFactory> */
    protected $fillable = [
        'virtual_tour_id',
        'title',
        'image',
        'initial_pitch',
        'initial_yaw',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'initial_pitch' => 'float',
            'initial_yaw' => 'float',
            'order' => 'integer',
        ];
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(VirtualTour::class, 'virtual_tour_id');
    }

    public function hotspots(): HasMany
    {
        return $this->hasMany(VirtualTourHotspot::class)->orderBy('order');
    }
}
