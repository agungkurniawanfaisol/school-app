<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Testimonial\StoreTestimonialRequest;
use App\Http\Requests\Testimonial\UpdateTestimonialRequest;
use App\Http\Resources\V1\TestimonialResource;
use App\Repositories\BaseRepository;
use App\Repositories\TestimonialRepository;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    use HandlesCrud;

    public function __construct(private TestimonialRepository $testimonialRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->testimonialRepository;
    }

    protected function resourceClass(): string
    {
        return TestimonialResource::class;
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateTestimonialRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
