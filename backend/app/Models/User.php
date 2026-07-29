<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    public const ROLE_ADMIN = 'admin';

    public const ROLE_GURU = 'guru';

    public const ROLE_ADMIN_PMB = 'admin_pmb';

    public const ROLE_PENDAFTAR = 'pendaftar';

    public const PANEL_ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_GURU,
        self::ROLE_ADMIN_PMB,
    ];

    /** Roles that an admin may assign via user management CRUD. */
    public const ASSIGNABLE_ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_GURU,
        self::ROLE_ADMIN_PMB,
        self::ROLE_PENDAFTAR,
    ];

    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'teacher_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isGuru(): bool
    {
        return $this->role === self::ROLE_GURU;
    }

    public function isAdminPmb(): bool
    {
        return $this->role === self::ROLE_ADMIN_PMB;
    }

    public function isPendaftar(): bool
    {
        return $this->role === self::ROLE_PENDAFTAR;
    }

    public function canManagePmb(): bool
    {
        return $this->isAdmin() || $this->isAdminPmb();
    }

    public function isPanelUser(): bool
    {
        return in_array($this->role, self::PANEL_ROLES, true);
    }

    public function pmbRegistrations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PmbRegistration::class);
    }

    public function teacher(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function news(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(News::class);
    }

    public function media(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Media::class);
    }
}
