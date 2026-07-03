<?php

namespace App\Repositories;

use App\Models\Setting;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class SettingRepository extends BaseRepository implements RepositoryInterface
{
    protected function model(): string
    {
        return Setting::class;
    }

    protected function defaultSelect(): array
    {
        return ['id', 'school_id', 'group', 'key', 'value', 'type', 'created_at', 'updated_at'];
    }

    protected function searchableColumns(): array
    {
        return ['key'];
    }

    public function getByGroup(?int $schoolId, string $group): Collection
    {
        $key = $this->cacheKey('getByGroup', ['school_id' => $schoolId, 'group' => $group]);

        return $this->remember($key, function () use ($schoolId, $group) {
            return $this->newQuery()
                ->where('group', $group)
                ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
                ->get();
        });
    }
}
