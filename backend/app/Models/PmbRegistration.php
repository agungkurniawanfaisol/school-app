<?php

namespace App\Models;

use Database\Factories\PmbRegistrationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PmbRegistration extends Model
{
    use HasFactory, SoftDeletes;
    /** @use HasFactory<PmbRegistrationFactory> */

    public const STATUS_DRAFT = 'draft';

    /** Submitted; admin is verifying payment / data. */
    public const STATUS_AWAITING_VERIFICATION = 'awaiting_verification';

    /** Pendaftar may edit data and re-upload proof. */
    public const STATUS_NEEDS_REVISION = 'needs_revision';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_REJECTED = 'rejected';

    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_AWAITING_VERIFICATION,
        self::STATUS_NEEDS_REVISION,
        self::STATUS_ACCEPTED,
        self::STATUS_REJECTED,
    ];

    public const STATUS_LABELS = [
        self::STATUS_DRAFT => 'Draf',
        self::STATUS_AWAITING_VERIFICATION => 'Menunggu verifikasi',
        self::STATUS_NEEDS_REVISION => 'Perlu perbaikan',
        self::STATUS_ACCEPTED => 'Diterima',
        self::STATUS_REJECTED => 'Ditolak',
    ];

    public const STATUS_DESCRIPTIONS = [
        self::STATUS_DRAFT => 'Pendaftar masih mengisi formulir dan belum mengirim.',
        self::STATUS_AWAITING_VERIFICATION => 'Pendaftaran sudah dikirim. Admin memeriksa data dan bukti pembayaran. Pendaftar tidak dapat mengubah data.',
        self::STATUS_NEEDS_REVISION => 'Admin meminta perbaikan. Pendaftar dapat mengedit data/bukti, lalu mengirim ulang.',
        self::STATUS_ACCEPTED => 'Pendaftaran diterima. LoA dapat diterbitkan.',
        self::STATUS_REJECTED => 'Pendaftaran ditolak.',
    ];

    protected $fillable = [
        'uuid',
        'school_id',
        'user_id',
        'registration_number',
        'tracking_token',
        'student_name',
        'birth_place',
        'birth_date',
        'gender',
        'parent_name',
        'parent_phone',
        'parent_email',
        'address',
        'previous_school',
        'grade_applied',
        'academic_year',
        'pmb_fee_id',
        'status',
        'notes',
        'payment_info',
        'draft_payload',
        'current_step',
        'loa_issued_at',
        'loa_media_id',
        'notifications_seen_at',
        'admin_notifications_seen_at',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'payment_info' => 'array',
            'draft_payload' => 'array',
            'loa_issued_at' => 'datetime',
            'notifications_seen_at' => 'datetime',
            'admin_notifications_seen_at' => 'datetime',
            'current_step' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (PmbRegistration $model): void {
            $model->uuid ??= (string) Str::uuid();
            $model->tracking_token ??= Str::random(64);
            $model->registration_number ??= 'PMB-'.now()->format('Ymd').'-'.strtoupper(Str::random(6));
            $model->status ??= self::STATUS_DRAFT;
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function isEditableByPendaftar(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_NEEDS_REVISION], true);
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pmbFee(): BelongsTo
    {
        return $this->belongsTo(PmbFee::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PmbDocument::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(PmbRegistrationMessage::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(PmbRegistrationEvent::class);
    }

    public function emailLogs(): HasMany
    {
        return $this->hasMany(PmbEmailLog::class);
    }
}
