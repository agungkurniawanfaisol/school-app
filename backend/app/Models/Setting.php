<?php

namespace App\Models;

use Database\Factories\SettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Setting extends Model
{
    use HasFactory, SoftDeletes;
    /** @use HasFactory<SettingFactory> */

    protected $fillable = [
        'school_id',
        'group',
        'key',
        'value',
        'type',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
