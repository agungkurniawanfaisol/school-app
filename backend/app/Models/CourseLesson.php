<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseLesson extends Model
{
    use HasCommonScopes, SoftDeletes;

    protected $fillable = [
        'course_module_id',
        'title',
        'slug',
        'type',
        'content',
        'video_url',
        'duration_minutes',
        'order',
        'is_active',
        'is_free_preview',
    ];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'order' => 'integer',
            'is_active' => 'boolean',
            'is_free_preview' => 'boolean',
        ];
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'course_module_id');
    }
}
