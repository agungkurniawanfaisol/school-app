<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\Faq\StoreFaqRequest;
use App\Http\Requests\Faq\UpdateFaqRequest;
use App\Http\Resources\V1\FaqResource;
use App\Repositories\BaseRepository;
use App\Repositories\FaqRepository;
use Illuminate\Http\JsonResponse;

class FaqController extends Controller
{
    use HandlesCrud;

    public function __construct(private FaqRepository $faqRepository) {}

    protected function repository(): BaseRepository
    {
        return $this->faqRepository;
    }

    protected function resourceClass(): string
    {
        return FaqResource::class;
    }

    public function store(StoreFaqRequest $request): JsonResponse
    {
        return $this->performStore($request);
    }

    public function update(UpdateFaqRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }
}
