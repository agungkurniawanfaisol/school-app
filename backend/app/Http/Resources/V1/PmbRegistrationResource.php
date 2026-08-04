<?php

namespace App\Http\Resources\V1;

use App\Models\Media;
use App\Support\PmbMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PmbRegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isAdminContext = $request->is('api/admin/*');
        $isOwner = $request->user()
            && (int) $request->user()->id === (int) $this->user_id;

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'registration_number' => $this->registration_number,
            'student_name' => $this->student_name,
            'birth_place' => $this->birth_place,
            'birth_date' => $this->birth_date?->toDateString(),
            'gender' => $this->gender,
            'parent_name' => $this->parent_name,
            'parent_phone' => $this->parent_phone,
            'parent_email' => $this->parent_email,
            'address' => $this->address,
            'previous_school' => $this->previous_school,
            'grade_applied' => $this->grade_applied,
            'pmb_fee_id' => $this->pmb_fee_id,
            'academic_year' => $this->academic_year
                ?? (is_array($this->draft_payload) ? ($this->draft_payload['academic_year'] ?? null) : null),
            'status' => $this->status,
            'status_label' => \App\Models\PmbRegistration::STATUS_LABELS[$this->status] ?? $this->status,
            'status_description' => \App\Models\PmbRegistration::STATUS_DESCRIPTIONS[$this->status] ?? null,
            'has_admin_unread' => $this->when($isAdminContext, fn () => (bool) ($this->has_admin_unread ?? false)),
            'current_step' => $this->current_step,
            'draft_payload' => $this->when($isOwner || $isAdminContext, $this->draft_payload),
            'notes' => $this->when($isAdminContext, $this->notes),
            'payment_info' => $this->when($isOwner || $isAdminContext, fn () => $this->enrichedPaymentInfo()),
            'student_photo' => $this->when($isOwner || $isAdminContext, fn () => $this->studentPhotoPayload()),
            'loa_issued_at' => $this->loa_issued_at?->toIso8601String(),
            'loa_media_id' => $this->loa_media_id,
            'documents' => PmbDocumentResource::collection($this->whenLoaded('documents')),
            'events' => $this->whenLoaded('events', fn () => $this->events->map(fn ($event) => [
                'id' => $event->id,
                'type' => $event->type,
                'message' => $event->message,
                'actor' => $event->relationLoaded('actor') && $event->actor ? [
                    'id' => $event->actor->id,
                    'name' => $event->actor->name,
                    'role' => $event->actor->role,
                ] : null,
                'created_at' => $event->created_at?->toIso8601String(),
            ])),
            'messages' => $this->whenLoaded('messages', fn () => $this->messages->map(fn ($message) => [
                'id' => $message->id,
                'body' => $message->body,
                'media_id' => $message->media_id,
                'user' => $message->relationLoaded('user') && $message->user ? [
                    'id' => $message->user->id,
                    'name' => $message->user->name,
                    'role' => $message->user->role,
                ] : null,
                'created_at' => $message->created_at?->toIso8601String(),
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function enrichedPaymentInfo(): ?array
    {
        $info = $this->payment_info;
        if (! is_array($info)) {
            return null;
        }

        $media = $this->findMedia($info['proof_media_id'] ?? null);
        if ($media === null) {
            return $info;
        }

        return array_merge($info, [
            'proof_url' => PmbMediaUrl::resolve($media),
            'proof_mime_type' => $media->mime_type,
            'proof_name' => $media->original_name,
        ]);
    }

    /**
     * @return array{id: int, uuid: string, url: string|null, mime_type: string|null, original_name: string|null}|null
     */
    private function studentPhotoPayload(): ?array
    {
        $mediaId = is_array($this->draft_payload)
            ? ($this->draft_payload['student_photo_media_id'] ?? null)
            : null;

        $media = $this->findMedia($mediaId);
        if ($media === null) {
            return null;
        }

        return [
            'id' => $media->id,
            'uuid' => $media->uuid,
            'url' => PmbMediaUrl::resolve($media),
            'mime_type' => $media->mime_type,
            'original_name' => $media->original_name,
        ];
    }

    private function findMedia(mixed $mediaId): ?Media
    {
        if (! is_numeric($mediaId) || (int) $mediaId <= 0) {
            return null;
        }

        return Media::query()->whereKey((int) $mediaId)->first();
    }
}
