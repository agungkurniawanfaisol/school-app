<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PmbRegistration extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'school_id',
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
        'status',
        'notes',
        'payment_info',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'payment_info' => 'array',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PmbDocument::class);
    }
}
