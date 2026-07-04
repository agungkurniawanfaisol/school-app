<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Database\Factories\AchievementFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Achievement extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;
    /** @use HasFactory<AchievementFactory> */

    protected $fillable = [
        'school_id',
        'uuid',
        'title',
        'description',
        'category',
        'level',
        'student_name',
        'year',
        'image',
        'is_active',
        'order',
    ];

    protected static function booted(): void
    {
        static::creating(function (Model $model): void {
            $model->uuid ??= (string) Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
