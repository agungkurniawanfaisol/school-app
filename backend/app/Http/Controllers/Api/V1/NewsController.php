<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesPublicRead;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\NewsResource;
use App\Repositories\BaseRepository;
use App\Repositories\NewsRepository;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    use HandlesPublicRead;

    public function __construct(private NewsRepository $newsRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->newsRepository;
    }

    protected function resourceClass(): string
    {
        return NewsResource::class;
    }

    protected function publicFilters(Request $request): array
    {
        return array_merge($this->defaultPublicFilters($request), [
            'published' => true,
            'status' => 'published',
        ]);
    }
}
