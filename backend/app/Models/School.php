<?php

namespace App\Models;

use App\Traits\HasCommonScopes;
use Database\Factories\SchoolFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasCommonScopes, HasFactory, SoftDeletes;

    /** @use HasFactory<SchoolFactory> */

    protected $fillable = [
        'name',
        'slug',
        'tagline',
        'description',
        'logo',
        'favicon',
        'email',
        'phone',
        'whatsapp',
        'address',
        'city',
        'province',
        'postal_code',
        'latitude',
        'longitude',
        'map_embed_url',
        'vision',
        'mission',
        'social_media',
        'seo',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'social_media' => 'array',
            'seo' => 'array',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'is_active' => 'boolean',
        ];
    }

    public function heroSliders(): HasMany
    {
        return $this->hasMany(HeroSlider::class);
    }

    public function curriculums(): HasMany
    {
        return $this->hasMany(Curriculum::class);
    }

    public function teachers(): HasMany
    {
        return $this->hasMany(Teacher::class);
    }

    public function studentActivities(): HasMany
    {
        return $this->hasMany(StudentActivity::class);
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class);
    }

    public function news(): HasMany
    {
        return $this->hasMany(News::class);
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function pmbRegistrations(): HasMany
    {
        return $this->hasMany(PmbRegistration::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(Setting::class);
    }
}
