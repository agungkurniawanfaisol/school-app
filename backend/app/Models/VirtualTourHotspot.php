<?php

namespace App\Models;

use App\Traits\HasUuid;
use Database\Factories\VirtualTourHotspotFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VirtualTourHotspot extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    /** @use HasFactory<VirtualTourHotspotFactory> */
    protected $fillable = [
        'virtual_tour_scene_id',
        'target_scene_id',
        'label',
        'pitch',
        'yaw',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'pitch' => 'float',
            'yaw' => 'float',
            'order' => 'integer',
        ];
    }

    public function scene(): BelongsTo
    {
        return $this->belongsTo(VirtualTourScene::class, 'virtual_tour_scene_id');
    }

    public function targetScene(): BelongsTo
    {
        return $this->belongsTo(VirtualTourScene::class, 'target_scene_id');
    }
}
