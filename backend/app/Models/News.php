<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use App\Traits\HasUuid;
use Database\Factories\NewsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use HasCommonScopes, HasFactory, HasUuid, SoftDeletes;
    /** @use HasFactory<NewsFactory> */

    protected $fillable = [
        'school_id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'content_json',
        'thumbnail',
        'category',
        'status',
        'order',
        'is_active',
        'is_featured',
        'published_at',
        'publish_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'publish_ends_at' => 'datetime',
            'order' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'content_json' => 'array',
        ];
    }

    public function resolveDisplayStatus(): string
    {
        return \App\Support\NewsPublishSchedule::resolveDisplayStatus($this);
    }

    public function scopePublished(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where(function (\Illuminate\Database\Eloquent\Builder $q) {
                $q->whereNull('publish_ends_at')
                    ->orWhere('publish_ends_at', '>', now());
            });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
