<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasCommonScopes, HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'school_id',
        'title',
        'slug',
        'content',
        'priority',
        'is_pinned',
        'published_at',
        'expires_at',
        'is_active',
        'order',
        'cta_text',
        'cta_url',
    ];

    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function scopeCurrentlyActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q): void {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->where(function (Builder $q): void {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
