<?php

namespace App\Models;

use Database\Factories\PmbProgramFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PmbProgram extends Model
{
    use HasFactory, SoftDeletes;
    /** @use HasFactory<PmbProgramFactory> */

    protected $fillable = [
        'uuid',
        'school_id',
        'code',
        'name',
        'sort_order',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (PmbProgram $model): void {
            $model->uuid ??= (string) Str::uuid();
            if ($model->code !== null) {
                $model->code = Str::lower(trim((string) $model->code));
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function fees(): HasMany
    {
        return $this->hasMany(PmbFee::class);
    }
}
