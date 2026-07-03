<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesPublicRead;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\StudentActivityResource;
use App\Repositories\BaseRepository;
use App\Repositories\StudentActivityRepository;
use Illuminate\Http\Request;

class StudentActivityController extends Controller
{
    use HandlesPublicRead;

    public function __construct(private StudentActivityRepository $studentActivityRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->studentActivityRepository;
    }

    protected function resourceClass(): string
    {
        return StudentActivityResource::class;
    }

    protected function publicFilters(Request $request): array
    {
        return array_merge($this->defaultPublicFilters($request), ['published' => true]);
    }
}
