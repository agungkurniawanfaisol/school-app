<?php

namespace App\Models;

use Database\Factories\PmbFeeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PmbFee extends Model
{
    use HasFactory, SoftDeletes;
    /** @use HasFactory<PmbFeeFactory> */

    protected $fillable = [
        'uuid',
        'school_id',
        'academic_year_id',
        'amount',
        'notes',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::creating(function (PmbFee $model): void {
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
            'amount' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
