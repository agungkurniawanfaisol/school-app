<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use App\Traits\HasUuid;
use Database\Factories\TeacherFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasCommonScopes, HasFactory, HasUuid, SoftDeletes;
    /** @use HasFactory<TeacherFactory> */

    protected $fillable = [
        'school_id',
        'name',
        'slug',
        'title',
        'subject',
        'bio',
        'content',
        'content_json',
        'photo',
        'email',
        'social_media',
        'order',
        'is_active',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'social_media' => 'array',
            'content_json' => 'array',
            'order' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(User::class);
    }
}
