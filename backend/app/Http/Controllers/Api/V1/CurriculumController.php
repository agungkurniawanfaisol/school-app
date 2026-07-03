<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesPublicRead;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CurriculumResource;
use App\Repositories\BaseRepository;
use App\Repositories\CurriculumRepository;
use Illuminate\Http\Request;

class CurriculumController extends Controller
{
    use HandlesPublicRead;

    public function __construct(private CurriculumRepository $curriculumRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->curriculumRepository;
    }

    protected function resourceClass(): string
    {
        return CurriculumResource::class;
    }
}
