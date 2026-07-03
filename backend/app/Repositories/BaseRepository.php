<?php

namespace App\Repositories;

use App\Repositories\Contracts\RepositoryInterface;
use App\Traits\HasCache;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

abstract class BaseRepository implements RepositoryInterface
{
    use HasCache;

    abstract protected function model(): string;

    protected function defaultWith(): array
    {
        return [];
    }

    protected function defaultSelect(): array
    {
        return ['*'];
    }

    protected function cacheTag(): string
    {
        return strtolower(class_basename($this->model()));
    }

    protected function newQuery(): Builder
    {
        $query = $this->model()::query();

        $select = $this->defaultSelect();
        if ($select !== ['*']) {
            $query->select($select);
        }

        $with = $this->defaultWith();
        if ($with !== []) {
            $query->with($with);
        }

        return $query;
    }

    protected function applyFilters(Builder $query, array $filters = []): Builder
    {
        if (isset($filters['school_id'])) {
            $query->where('school_id', $filters['school_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_featured'])) {
            $query->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['facility_id'])) {
            $query->where('facility_id', $filters['facility_id']);
        }

        if (isset($filters['course_id'])) {
            $query->where('course_id', $filters['course_id']);
        }

        if (isset($filters['course_module_id'])) {
            $query->where('course_module_id', $filters['course_module_id']);
        }

        if (isset($filters['pmb_registration_id'])) {
            $query->where('pmb_registration_id', $filters['pmb_registration_id']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search): void {
                foreach ($this->searchableColumns() as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        if (! empty($filters['published'])) {
            $query->published();
        }

        if (! empty($filters['active'])) {
            $query->active();
        }

        if (! empty($filters['featured'])) {
            $query->featured();
        }

        if (! empty($filters['ordered'])) {
            $query->ordered();
        }

        return $query;
    }

    protected function searchableColumns(): array
    {
        return ['title'];
    }

    public function all(array $filters = []): Collection
    {
        $key = $this->cacheKey('all', $filters);

        $result = $this->remember($key, function () use ($filters) {
            return $this->applyFilters($this->newQuery(), $filters)->get();
        });

        if (! $result instanceof Collection) {
            Cache::forget($key);

            return $this->applyFilters($this->newQuery(), $filters)->get();
        }

        return $result;
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->applyFilters($this->newQuery(), $filters)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(int $id, array $with = []): ?Model
    {
        $query = $this->newQuery()->whereKey($id);

        if ($with !== []) {
            $query->with($with);
        }

        return $query->first();
    }

    public function findBySlug(string $slug, array $with = []): ?Model
    {
        $query = $this->newQuery()->where('slug', $slug);

        if ($with !== []) {
            $query->with($with);
        }

        return $query->first();
    }

    public function findByUuid(string $uuid, array $with = []): ?Model
    {
        $key = $this->cacheKey('findByUuid', ['uuid' => $uuid]);

        $result = $this->remember($key, function () use ($uuid, $with) {
            $query = $this->newQuery()->where('uuid', $uuid);

            if ($with !== []) {
                $query->with($with);
            }

            return $query->first();
        });

        if ($result instanceof Model) {
            return $result;
        }

        Cache::forget($key);

        $query = $this->newQuery()->where('uuid', $uuid);

        if ($with !== []) {
            $query->with($with);
        }

        return $query->first();
    }

    public function create(array $data): Model
    {
        $model = $this->model()::create($data);
        $this->clearCache();

        return $model->fresh($this->defaultWith());
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);
        $this->clearCache();

        return $model->fresh($this->defaultWith());
    }

    public function delete(Model $model): bool
    {
        $deleted = (bool) $model->delete();
        $this->clearCache();

        return $deleted;
    }
}
