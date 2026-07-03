<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesPublicRead;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\TeacherResource;
use App\Repositories\BaseRepository;
use App\Repositories\TeacherRepository;

class TeacherController extends Controller
{
    use HandlesPublicRead;

    public function __construct(private TeacherRepository $teacherRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->teacherRepository;
    }

    protected function resourceClass(): string
    {
        return TeacherResource::class;
    }
}
