<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Database\Factories\HeroSliderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class HeroSlider extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;
    /** @use HasFactory<HeroSliderFactory> */

    protected $fillable = [
        'school_id',
        'title',
        'subtitle',
        'image',
        'cta_text',
        'cta_url',
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

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
