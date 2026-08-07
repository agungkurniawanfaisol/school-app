<?php

namespace App\Repositories;

use App\Models\PmbFee;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PmbFeeRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return PmbFee::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'uuid', 'school_id', 'academic_year_id', 'name', 'jenjang', 'pmb_program_id', 'program',
            'amount', 'bank_name', 'account_number', 'account_holder', 'notes', 'is_active',
            'created_at', 'updated_at',
        ];
    }

    protected function defaultWith(): array
    {
        return [
            'academicYear:id,uuid,label,is_active',
            'school:id,name,slug',
            'pmbProgram:id,uuid,code,name,is_active',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['name', 'notes', 'bank_name', 'account_holder', 'jenjang', 'program'];
    }

    public function findActiveForSchool(int $schoolId): ?Model
    {
        $key = $this->cacheKey('findActiveForSchool', ['school_id' => $schoolId]);

        return $this->remember($key, function () use ($schoolId) {
            return $this->newQuery()
                ->where('school_id', $schoolId)
                ->where('is_active', true)
                ->orderBy('jenjang')
                ->orderBy('program')
                ->orderByDesc('id')
                ->first();
        });
    }

    /**
     * @return Collection<int, PmbFee>
     */
    public function listActiveForSchool(int $schoolId): Collection
    {
        $key = $this->cacheKey('listActiveForSchool', ['school_id' => $schoolId]);

        return $this->remember($key, function () use ($schoolId) {
            return $this->newQuery()
                ->where('school_id', $schoolId)
                ->where('is_active', true)
                ->orderBy('jenjang')
                ->orderBy('program')
                ->orderBy('id')
                ->get();
        });
    }

    public function findActiveByUuidForSchool(string $uuid, int $schoolId): ?PmbFee
    {
        $fee = $this->newQuery()
            ->where('uuid', $uuid)
            ->where('school_id', $schoolId)
            ->where('is_active', true)
            ->first();

        return $fee instanceof PmbFee ? $fee : null;
    }

    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            // Unique (school_id, academic_year_id, jenjang, program) still applies to soft-deleted rows.
            $trashed = $this->model()::withTrashed()
                ->where('school_id', $data['school_id'])
                ->where('academic_year_id', $data['academic_year_id'])
                ->where('jenjang', $data['jenjang'])
                ->where('pmb_program_id', $data['pmb_program_id'])
                ->onlyTrashed()
                ->first();

            if ($trashed instanceof PmbFee) {
                $trashed->restore();
                $trashed->update([
                    'name' => $data['name'],
                    'program' => $data['program'] ?? $trashed->program,
                    'pmb_program_id' => $data['pmb_program_id'],
                    'amount' => $data['amount'],
                    'bank_name' => $data['bank_name'] ?? null,
                    'account_number' => $data['account_number'] ?? null,
                    'account_holder' => $data['account_holder'] ?? null,
                    'notes' => $data['notes'] ?? null,
                    'is_active' => (bool) ($data['is_active'] ?? false),
                ]);
                $model = $trashed->fresh();
            } else {
                $model = $this->model()::create($data);
            }

            $this->clearCache();

            return $model->fresh($this->defaultWith());
        });
    }

    public function update(Model $model, array $data): Model
    {
        return DB::transaction(function () use ($model, $data) {
            $model->update($data);
            $fresh = $model->fresh($this->defaultWith());
            $this->clearCache();

            return $fresh;
        });
    }
}
