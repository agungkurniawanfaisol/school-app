<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PmbEmailLog extends Model
{
    use SoftDeletes;

    public const TYPE_SUBMITTED = 'submitted';

    public const TYPE_ACCEPTED = 'accepted';

    public const TYPE_CUSTOM = 'custom';

    public const TYPE_BROADCAST = 'broadcast';

    public const STATUS_QUEUED = 'queued';

    public const STATUS_SENT = 'sent';

    public const STATUS_FAILED = 'failed';

    public const STATUS_SKIPPED = 'skipped';

    protected $fillable = [
        'uuid',
        'pmb_registration_id',
        'type',
        'recipient_email',
        'subject',
        'body',
        'status',
        'error_message',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (PmbEmailLog $model): void {
            $model->uuid ??= (string) Str::uuid();
        });
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(PmbRegistration::class, 'pmb_registration_id');
    }
}
