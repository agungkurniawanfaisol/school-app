<?php

namespace App\Repositories;

use App\Models\AppRelease;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AppReleaseRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return AppRelease::class;
    }

    protected function defaultSelect(): array
    {
        return [
            'id', 'uuid', 'version', 'title', 'body', 'published_at', 'is_published',
            'created_at', 'updated_at',
        ];
    }

    protected function searchableColumns(): array
    {
        return ['version', 'title', 'body'];
    }

    protected function applyFilters(Builder $query, array $filters = []): Builder
    {
        $query = parent::applyFilters($query, $filters);

        return $query->orderByDesc('published_at')->orderByDesc('id');
    }

    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            if (! empty($data['is_published']) && empty($data['published_at'])) {
                $data['published_at'] = now();
            }

            $model = $this->model()::create($data);
            $this->clearCache();

            return $model->fresh($this->defaultWith());
        });
    }

    public function update(Model $model, array $data): Model
    {
        return DB::transaction(function () use ($model, $data) {
            if (array_key_exists('is_published', $data) && $data['is_published'] && empty($data['published_at']) && ! $model->published_at) {
                $data['published_at'] = now();
            }

            $model->update($data);
            $this->clearCache();

            return $model->fresh($this->defaultWith());
        });
    }
}
