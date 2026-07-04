<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PhotoAlbum extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;

    protected $fillable = [
        'school_id',
        'uuid',
        'title',
        'slug',
        'description',
        'cover_image',
        'event_date',
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
            'event_date' => 'date',
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(AlbumPhoto::class);
    }
}
