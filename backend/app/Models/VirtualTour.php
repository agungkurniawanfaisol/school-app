<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use App\Traits\HasUuid;
use Database\Factories\VirtualTourFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VirtualTour extends Model
{
    use HasCommonScopes, HasFactory, HasUuid, SoftDeletes;

    /** @use HasFactory<VirtualTourFactory> */
    protected $fillable = [
        'school_id',
        'title',
        'slug',
        'description',
        'start_scene_id',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function scenes(): HasMany
    {
        return $this->hasMany(VirtualTourScene::class)->orderBy('order');
    }

    public function startScene(): BelongsTo
    {
        return $this->belongsTo(VirtualTourScene::class, 'start_scene_id');
    }
}
