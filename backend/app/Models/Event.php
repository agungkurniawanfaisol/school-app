<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;
    /** @use HasFactory<EventFactory> */

    protected $fillable = [
        'school_id',
        'uuid',
        'title',
        'description',
        'location',
        'event_date',
        'event_end_date',
        'event_time',
        'category',
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
            'event_end_date' => 'date',
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
