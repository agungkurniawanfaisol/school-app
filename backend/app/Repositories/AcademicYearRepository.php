<?php

namespace App\Repositories;

use App\Models\AcademicYear;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AcademicYearRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return AcademicYear::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'uuid', 'school_id', 'label', 'is_active', 'created_at', 'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['label'];
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

            $model = $this->model()::create($data);
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
            $this->clearCache();

            return $model->fresh($this->defaultWith());
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
}
