<?php

namespace App\Repositories;

use App\Models\PmbProgram;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PmbProgramRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return PmbProgram::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'uuid', 'school_id', 'code', 'name', 'sort_order', 'is_active',
            'created_at', 'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['code', 'name'];
    }

    protected function applyFilters(Builder $query, array $filters = []): Builder
    {
        $query = parent::applyFilters($query, $filters);

        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            $model = $this->model()::create($data);
            $this->clearCache();

            return $model->fresh($this->defaultWith());
        });
    }

    public function update(Model $model, array $data): Model
    {
        return DB::transaction(function () use ($model, $data) {
            unset($data['code']);
            $model->update($data);
            $this->clearCache();

            return $model->fresh($this->defaultWith());
        });
    }
}
