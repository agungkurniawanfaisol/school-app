<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;
    /** @use HasFactory<TestimonialFactory> */

    protected $fillable = [
        'school_id',
        'name',
        'role',
        'content',
        'photo',
        'rating',
        'order',
        'is_active',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'order' => 'integer',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
