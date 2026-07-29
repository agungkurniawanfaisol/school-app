<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PmbRegistrationMessage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pmb_registration_id',
        'user_id',
        'body',
        'media_id',
        'read_at',
        'admin_read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'admin_read_at' => 'datetime',
        ];
    }
    public function registration(): BelongsTo
    {
        return $this->belongsTo(PmbRegistration::class, 'pmb_registration_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
