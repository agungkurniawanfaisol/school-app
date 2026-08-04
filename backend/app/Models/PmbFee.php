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

    public const JENJANG_TK = 'tk';

    public const JENJANG_SD = 'sd';

    public const JENJANGS = [self::JENJANG_TK, self::JENJANG_SD];

    public const PROGRAM_REGULER = 'reguler';

    public const PROGRAM_ICP = 'icp';

    public const PROGRAMS = [self::PROGRAM_REGULER, self::PROGRAM_ICP];

    protected $fillable = [
        'uuid',
        'school_id',
        'academic_year_id',
        'name',
        'jenjang',
        'program',
        'amount',
        'bank_name',
        'account_number',
        'account_holder',
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

    public function gradeAppliedLabel(): string
    {
        return strtoupper($this->jenjang);
    }

    /**
     * @return array<string, mixed>
     */
    public function toPaymentSnapshot(): array
    {
        return [
            'pmb_fee_uuid' => $this->uuid,
            'fee_name' => $this->name,
            'jenjang' => $this->jenjang,
            'program' => $this->program,
            'amount' => (int) $this->amount,
            'amount_formatted' => \App\Support\Rupiah::format((int) $this->amount),
            'bank_name' => $this->bank_name,
            'account_number' => $this->account_number,
            'account_holder' => $this->account_holder,
        ];
    }
}
