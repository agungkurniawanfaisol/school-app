<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PmbDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pmb_registration_id',
        'document_type',
        'file_path',
        'original_name',
        'status',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(PmbRegistration::class, 'pmb_registration_id');
    }
}
