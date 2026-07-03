<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesPublicRead;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CourseResource;
use App\Repositories\BaseRepository;
use App\Repositories\CourseRepository;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    use HandlesPublicRead;

    public function __construct(private CourseRepository $courseRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->courseRepository;
    }

    protected function resourceClass(): string
    {
        return CourseResource::class;
    }

    protected function publicFilters(Request $request): array
    {
        return array_merge($this->defaultPublicFilters($request), [
            'published' => true,
            'status' => 'published',
        ]);
    }
}
