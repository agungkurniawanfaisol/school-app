<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Curriculum extends Model
{
    use HasCommonScopes, SoftDeletes;

    protected $table = 'curriculums';

    protected $fillable = [
        'school_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'icon',
        'thumbnail',
        'category',
        'order',
        'is_active',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
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
