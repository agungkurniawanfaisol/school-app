<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use App\Traits\HasUuid;
use Database\Factories\StudentActivityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentActivity extends Model
{
    use HasCommonScopes, HasFactory, HasUuid, SoftDeletes;
    /** @use HasFactory<StudentActivityFactory> */

    protected $fillable = [
        'school_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'content_json',
        'thumbnail',
        'category',
        'status',
        'activity_date',
        'order',
        'is_active',
        'is_featured',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'activity_date' => 'date',
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
}
