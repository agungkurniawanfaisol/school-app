<?php

namespace App\Http\Resources\V1;

use App\Http\Resources\Concerns\ExposesRichContent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    use ExposesRichContent;

    public function toArray(Request $request): array
    {
        $isDetail = $this->isDetailRequest($request);

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'school_id' => $this->school_id,
            'type' => $this->type,
            'name' => $this->name,
            'slug' => $this->slug,
            'title' => $this->title,
            'subject' => $this->subject,
            'bio' => $this->bio,
            'content' => $this->when($this->exposesFullContent($request), $this->content),
            'content_json' => $this->when(
                $this->isAdminRequest($request) || $this->exposesFullContent($request),
                $this->content_json,
            ),
            'photo' => $this->photo,
            'email' => $this->when($isDetail, $this->email),
            'social_media' => $this->when($isDetail, $this->social_media),
            'order' => $this->order,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'has_linked_user' => $this->when(
                $this->isAdminRequest($request) && $this->relationLoaded('user'),
                fn () => $this->user !== null,
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function isDetailRequest(Request $request): bool
    {
        return $this->isAdminRequest($request) || $this->exposesFullContent($request);
    }
}
