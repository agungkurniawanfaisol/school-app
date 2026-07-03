<?php

namespace App\Models;

use Database\Factories\CourseEnrollmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseEnrollment extends Model
{
    use HasFactory, SoftDeletes;
    /** @use HasFactory<CourseEnrollmentFactory> */

    protected $fillable = [
        'course_id',
        'user_id',
        'student_name',
        'student_email',
        'status',
        'enrolled_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'enrolled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(CourseProgress::class);
    }
}
