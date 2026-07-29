<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PmbRegistrationEvent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pmb_registration_id',
        'actor_user_id',
        'type',
        'message',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
        ];
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(PmbRegistration::class, 'pmb_registration_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}
