<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use App\Traits\HasUuid;
use Database\Factories\TeacherFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasCommonScopes, HasFactory, HasUuid, SoftDeletes;
    /** @use HasFactory<TeacherFactory> */

    public const TYPE_KEPALA_SEKOLAH = 'kepala_sekolah';
    public const TYPE_GURU = 'guru';
    public const TYPE_STAFF = 'staff';

    public const TYPES = [
        self::TYPE_KEPALA_SEKOLAH,
        self::TYPE_GURU,
        self::TYPE_STAFF,
    ];

    protected $fillable = [
        'school_id',
        'type',
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

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
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
