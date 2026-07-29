<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use App\Traits\HasUuid;
use Database\Factories\StudentActivityPhotoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentActivityPhoto extends Model
{
    use HasCommonScopes, HasFactory, HasUuid, SoftDeletes;
    /** @use HasFactory<StudentActivityPhotoFactory> */

    protected $fillable = [
        'student_activity_id',
        'path',
        'caption',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function studentActivity(): BelongsTo
    {
        return $this->belongsTo(StudentActivity::class);
    }
}
