<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;
    /** @use HasFactory<CourseFactory> */

    protected $fillable = [
        'school_id',
        'title',
        'slug',
        'excerpt',
        'description',
        'thumbnail',
        'category',
        'level',
        'duration_minutes',
        'price',
        'status',
        'order',
        'is_active',
        'is_featured',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'price' => 'decimal:2',
            'published_at' => 'datetime',
            'order' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }
}
