<?php

namespace App\Models;

use Database\Factories\PmbDocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PmbDocument extends Model
{
    use HasFactory, SoftDeletes;
    /** @use HasFactory<PmbDocumentFactory> */

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
