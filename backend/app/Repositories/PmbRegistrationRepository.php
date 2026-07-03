<?php

namespace App\Repositories;

use App\Models\PmbRegistration;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class PmbRegistrationRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return PmbRegistration::class;
    }

    protected function defaultWith(): array
    {
        return [
            'documents' => fn ($q) => $q->select(['id', 'pmb_registration_id', 'document_type', 'file_path', 'original_name', 'status', 'created_at']),
        ];
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'registration_number', 'tracking_token', 'student_name', 'birth_place', 'birth_date', 'gender', 'parent_name', 'parent_phone', 'parent_email', 'address', 'previous_school', 'grade_applied', 'status', 'notes', 'payment_info', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['student_name', 'registration_number'];
    }

    public function findByTrackingToken(string $token): ?Model
    {
        $key = $this->cacheKey('findByTrackingToken', ['token' => $token]);

        return $this->remember($key, function () use ($token) {
            return $this->newQuery()->where('tracking_token', $token)->first();
        });
    }
}
