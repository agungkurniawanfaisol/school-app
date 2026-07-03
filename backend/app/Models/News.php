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
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'order' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'content_json' => 'array',
        ];
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
