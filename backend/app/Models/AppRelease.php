<?php

namespace App\Models;

use Database\Factories\AppReleaseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AppRelease extends Model
{
    use HasFactory, SoftDeletes;
    /** @use HasFactory<AppReleaseFactory> */

    protected $fillable = [
        'uuid',
        'version',
        'title',
        'body',
        'published_at',
        'is_published',
    ];

    protected static function booted(): void
    {
        static::creating(function (AppRelease $model): void {
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
            'published_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
