<?php

namespace App\Http\Resources\V1;

use App\Http\Resources\Concerns\ExposesRichContent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    use ExposesRichContent;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($this->exposesFullContent($request), $this->content),
            'content_json' => $this->when(
                $this->isAdminRequest($request) || $this->exposesFullContent($request),
                $this->content_json,
            ),
            'thumbnail' => $this->thumbnail,
            'category' => $this->category,
            'status' => $this->when($this->isAdminRequest($request), $this->status),
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at?->toIso8601String(),
            'author' => $this->whenLoaded('author', fn () => [
                'id' => $this->author->id,
                'name' => $this->author->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
