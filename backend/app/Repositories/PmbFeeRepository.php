<?php

namespace App\Repositories;

use App\Models\PmbFee;
use App\Models\Setting;
use App\Repositories\Contracts\RepositoryInterface;
use App\Support\Rupiah;
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
            'id', 'uuid', 'school_id', 'academic_year_id', 'amount', 'notes', 'is_active',
            'created_at', 'updated_at',
        ];
    }

    protected function defaultWith(): array
    {
        return [
            'academicYear:id,uuid,label,is_active',
            'school:id,name,slug',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['notes'];
    }

    public function findActiveForSchool(int $schoolId): ?Model
    {
        $key = $this->cacheKey('findActiveForSchool', ['school_id' => $schoolId]);

        return $this->remember($key, function () use ($schoolId) {
            return $this->newQuery()
                ->where('school_id', $schoolId)
                ->where('is_active', true)
                ->orderByDesc('id')
                ->first();
        });
    }

    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            if (! empty($data['is_active'])) {
                $this->deactivateOthers((int) $data['school_id']);
            }

            // Unique (school_id, academic_year_id) still applies to soft-deleted rows.
            // Restore + update instead of inserting a conflicting row.
            $trashed = $this->model()::withTrashed()
                ->where('school_id', $data['school_id'])
                ->where('academic_year_id', $data['academic_year_id'])
                ->onlyTrashed()
                ->first();

            if ($trashed instanceof PmbFee) {
                $trashed->restore();
                $trashed->update([
                    'amount' => $data['amount'],
                    'notes' => $data['notes'] ?? null,
                    'is_active' => (bool) ($data['is_active'] ?? false),
                ]);
                $model = $trashed->fresh();
            } else {
                $model = $this->model()::create($data);
            }

            $this->syncSettingIfActive($model);
            $this->clearCache();

            return $model->fresh($this->defaultWith());
        });
    }

    public function update(Model $model, array $data): Model
    {
        return DB::transaction(function () use ($model, $data) {
            if (! empty($data['is_active'])) {
                $this->deactivateOthers((int) $model->school_id, (int) $model->id);
            }

            $model->update($data);
            $fresh = $model->fresh($this->defaultWith());
            $this->syncSettingIfActive($fresh);
            $this->clearCache();

            return $fresh;
        });
    }

    private function deactivateOthers(int $schoolId, ?int $exceptId = null): void
    {
        $query = $this->model()::query()
            ->where('school_id', $schoolId)
            ->where('is_active', true);

        if ($exceptId !== null) {
            $query->whereKeyNot($exceptId);
        }

        $query->update(['is_active' => false]);
    }

    private function syncSettingIfActive(?Model $model): void
    {
        if (! $model instanceof PmbFee || ! $model->is_active) {
            return;
        }

        Setting::query()->updateOrCreate(
            [
                'school_id' => $model->school_id,
                'group' => 'pmb',
                'key' => 'pmb_fee',
            ],
            [
                'value' => Rupiah::format((int) $model->amount),
                'type' => 'string',
            ],
        );
    }
}
