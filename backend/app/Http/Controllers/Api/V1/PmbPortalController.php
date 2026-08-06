<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\IssuesAdminToken;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\PmbRegistration\PortalCorrectionPmbRegistrationRequest;
use App\Http\Requests\PmbRegistration\PortalDraftPmbRegistrationRequest;
use App\Http\Requests\PmbRegistration\PortalMarkNotificationsReadRequest;
use App\Http\Requests\PmbRegistration\PortalMessagePmbRegistrationRequest;
use App\Http\Requests\PmbRegistration\PortalSubmitPmbRegistrationRequest;
use App\Http\Requests\PmbRegistration\PortalTestimonialRequest;
use App\Http\Requests\PmbRegistration\PortalUploadRequest;
use App\Http\Resources\V1\MediaResource;
use App\Http\Resources\V1\PmbRegistrationResource;
use App\Http\Resources\V1\PortalTestimonialResource;
use App\Models\Media;
use App\Models\PmbRegistration;
use App\Models\PmbRegistrationEvent;
use App\Models\PmbRegistrationMessage;
use App\Models\School;
use App\Models\Testimonial;
use App\Models\User;
use App\Repositories\AcademicYearRepository;
use App\Repositories\PmbFeeRepository;
use App\Repositories\PmbRegistrationRepository;
use App\Repositories\TestimonialRepository;
use App\Services\PmbEmailService;
use App\Support\PmbPortalAvatar;
use App\Support\TestimonialPhotoPublisher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PmbPortalController extends Controller
{
    use IssuesAdminToken;

    public function __construct(
        private PmbRegistrationRepository $pmbRegistrationRepository,
        private AcademicYearRepository $academicYearRepository,
        private PmbFeeRepository $pmbFeeRepository,
        private TestimonialRepository $testimonialRepository,
        private PmbEmailService $pmbEmailService,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()
            ->where('email', $request->validated('email'))
            ->where('is_active', true)
            ->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial tidak valid.'],
            ]);
        }

        if (! $user->isPendaftar()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        return $this->issueAuthResponse($user);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => PmbPortalAvatar::resolveForUser($user),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function notifications(Request $request): JsonResponse
    {
        $payload = $this->pmbRegistrationRepository->getNotificationsForUser((int) $request->user()->id);

        return response()->json(['data' => $payload]);
    }

    public function markNotificationsRead(PortalMarkNotificationsReadRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $payload = $this->pmbRegistrationRepository->markNotificationsReadForUser(
            (int) $request->user()->id,
            (bool) ($validated['all'] ?? false),
            array_map('intval', $validated['message_ids'] ?? []),
        );

        return response()->json([
            'message' => 'Notifikasi ditandai dibaca.',
            'data' => $payload,
        ]);
    }

    public function upload(PortalUploadRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $collection = $request->validated('collection');
        $originalName = Str::limit(
            preg_replace('/[\x00-\x1F\x7F]/', '', (string) $file->getClientOriginalName()) ?? '',
            255,
            '',
        );
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs("uploads/{$collection}", $filename, 'local');

        $media = Media::query()->create([
            'user_id' => $request->user()?->id,
            'filename' => $filename,
            'original_name' => $originalName,
            'path' => $path,
            'disk' => 'local',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'collection' => $collection,
            'meta' => ['purpose' => $request->validated('purpose')],
        ]);

        return response()->json([
            'message' => 'File berhasil diunggah.',
            'data' => new MediaResource($media),
        ], 201);
    }

    public function showMedia(Request $request, Media $media): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        if ($media->collection !== 'pmb' || $media->disk !== 'local') {
            abort(404);
        }

        if (! is_string($media->path) || $media->path === '' || str_contains($media->path, '..')) {
            abort(404);
        }

        if (! Storage::disk('local')->exists($media->path)) {
            abort(404);
        }

        $filename = $media->original_name ?: $media->filename ?: 'bukti-transfer';
        $headers = [
            'Content-Type' => $media->mime_type ?? 'application/octet-stream',
        ];

        if ($request->boolean('download')) {
            return Storage::disk('local')->download($media->path, $filename, $headers);
        }

        return Storage::disk('local')->response(
            $media->path,
            $filename,
            $headers,
        );
    }

    public function showTestimonial(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json([
                'message' => 'Data sekolah belum tersedia. Jalankan migrasi/seed database terlebih dahulu.',
            ], 503);
        }

        $testimonial = $this->testimonialRepository->findForUser($request->user()->id, $schoolId);

        return response()->json([
            'data' => $testimonial ? new PortalTestimonialResource($testimonial) : null,
        ]);
    }

    public function upsertTestimonial(PortalTestimonialRequest $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json([
                'message' => 'Data sekolah belum tersedia. Jalankan migrasi/seed database terlebih dahulu.',
            ], 503);
        }

        $user = $request->user();
        $validated = $request->validated();
        $testimonial = $this->testimonialRepository->findForUser($user->id, $schoolId);
        $created = $testimonial === null;

        $photoUrl = $testimonial?->photo;
        if (! empty($validated['photo_media_id'])) {
            $media = Media::query()
                ->whereKey((int) $validated['photo_media_id'])
                ->where('user_id', $user->id)
                ->where('collection', 'pmb')
                ->where('mime_type', 'like', 'image/%')
                ->firstOrFail();

            $photoUrl = TestimonialPhotoPublisher::publishFromPmbMedia($media);
        }

        $payload = [
            'school_id' => $schoolId,
            'user_id' => $user->id,
            'name' => $user->name,
            'role' => $validated['role'] ?? 'Orang Tua Pendaftar',
            'content' => $validated['content'],
            'rating' => (int) $validated['rating'],
            'photo' => $photoUrl,
            'is_active' => false,
            'is_featured' => false,
        ];

        if ($testimonial) {
            $testimonial = $this->testimonialRepository->update($testimonial, $payload);
            $message = 'Testimoni berhasil diperbarui. Menunggu persetujuan admin.';
        } else {
            $testimonial = $this->testimonialRepository->create(array_merge($payload, ['order' => 0]));
            $message = 'Testimoni berhasil dikirim. Menunggu persetujuan admin.';
        }

        return response()->json([
            'message' => $message,
            'data' => new PortalTestimonialResource($testimonial),
        ], $created ? 201 : 200);
    }

    public function showDraft(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json([
                'message' => 'Data sekolah belum tersedia. Jalankan migrasi/seed database terlebih dahulu.',
            ], 503);
        }

        $registration = $this->findOrCreateDraft($request, $schoolId);

        return response()->json([
            'data' => new PmbRegistrationResource($registration->load(['documents', 'events', 'messages.user'])),
        ]);
    }

    public function saveDraft(PortalDraftPmbRegistrationRequest $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json([
                'message' => 'Data sekolah belum tersedia. Jalankan migrasi/seed database terlebih dahulu.',
            ], 503);
        }

        $registration = $this->findOrCreateDraft($request, $schoolId);
        if (! in_array($registration->status, [
            PmbRegistration::STATUS_DRAFT,
            PmbRegistration::STATUS_NEEDS_REVISION,
        ], true)) {
            return response()->json(['message' => 'Pendaftaran tidak dapat diubah pada status ini.'], 422);
        }

        $data = $request->validated();
        if (isset($data['payment_info']) && is_array($data['payment_info'])) {
            $data['payment_info'] = array_merge($registration->payment_info ?? [], $data['payment_info']);
        }

        if (isset($data['draft_payload']) && is_array($data['draft_payload'])) {
            $data['draft_payload'] = array_merge($registration->draft_payload ?? [], $data['draft_payload']);
        }

        if (empty($data['draft_payload']['academic_year'] ?? null)) {
            $data['draft_payload'] = array_merge($data['draft_payload'] ?? $registration->draft_payload ?? [], [
                'academic_year' => $this->resolveAcademicYear($schoolId),
            ]);
        }

        if (empty($data['academic_year'] ?? null)) {
            $data['academic_year'] = $data['draft_payload']['academic_year'] ?? $this->resolveAcademicYear($schoolId);
        }

        $feeError = $this->applySelectedFee($data, $schoolId, requireFee: false);
        if ($feeError !== null) {
            return $feeError;
        }

        // Never allow status change via draft/correction autosave.
        unset($data['status']);

        $registration = $this->pmbRegistrationRepository->update($registration, $data);

        return response()->json([
            'message' => $registration->status === PmbRegistration::STATUS_NEEDS_REVISION
                ? 'Perbaikan tersimpan.'
                : 'Draft tersimpan.',
            'data' => new PmbRegistrationResource($registration->load(['documents', 'events', 'messages.user'])),
        ]);
    }

    public function submitCorrection(PortalCorrectionPmbRegistrationRequest $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json([
                'message' => 'Data sekolah belum tersedia. Jalankan migrasi/seed database terlebih dahulu.',
            ], 503);
        }

        $registration = $this->findOrCreateDraft($request, $schoolId);
        if ($registration->status !== PmbRegistration::STATUS_NEEDS_REVISION) {
            return response()->json(['message' => 'Perbaikan hanya dapat dikirim saat status Perlu perbaikan.'], 422);
        }

        $data = $request->validated();
        $data['status'] = PmbRegistration::STATUS_AWAITING_VERIFICATION;
        $data['payment_info'] = array_merge($registration->payment_info ?? [], $data['payment_info']);
        if (isset($data['draft_payload']) && is_array($data['draft_payload'])) {
            $data['draft_payload'] = array_merge($registration->draft_payload ?? [], $data['draft_payload']);
        }
        if (empty($data['academic_year'] ?? null)) {
            $data['academic_year'] = $data['draft_payload']['academic_year'] ?? $registration->academic_year ?? $this->resolveAcademicYear($schoolId);
        }

        $feeError = $this->applySelectedFee($data, $schoolId, requireFee: true, existing: $registration);
        if ($feeError !== null) {
            return $feeError;
        }

        $registration = $this->pmbRegistrationRepository->update($registration, $data);

        $this->recordEvent($registration, $request->user()->id, 'correction_submitted', 'Pendaftar mengirim perbaikan data/bukti pembayaran.');

        return response()->json([
            'message' => 'Perbaikan berhasil dikirim.',
            'data' => new PmbRegistrationResource($registration->fresh(['documents', 'events', 'messages.user'])),
        ]);
    }

    public function submit(PortalSubmitPmbRegistrationRequest $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        if ($schoolId === null) {
            return response()->json([
                'message' => 'Data sekolah belum tersedia. Jalankan migrasi/seed database terlebih dahulu.',
            ], 503);
        }

        $registration = $this->findOrCreateDraft($request, $schoolId);
        if ($registration->status !== PmbRegistration::STATUS_DRAFT) {
            return response()->json(['message' => 'Pendaftaran sudah dikirim.'], 422);
        }

        $data = $request->validated();
        $data['status'] = PmbRegistration::STATUS_AWAITING_VERIFICATION;
        $data['payment_info'] = array_merge($registration->payment_info ?? [], $data['payment_info']);
        if (isset($data['draft_payload']) && is_array($data['draft_payload'])) {
            $data['draft_payload'] = array_merge($registration->draft_payload ?? [], $data['draft_payload']);
        }
        if (empty($data['academic_year'] ?? null)) {
            $data['academic_year'] = $data['draft_payload']['academic_year'] ?? $registration->academic_year ?? $this->resolveAcademicYear($schoolId);
        }
        $data['current_step'] = 5;

        $feeError = $this->applySelectedFee($data, $schoolId, requireFee: true, existing: $registration);
        if ($feeError !== null) {
            return $feeError;
        }

        $registration = $this->pmbRegistrationRepository->update($registration, $data);

        $this->recordEvent($registration, $request->user()->id, 'submitted', 'Pendaftaran dikirim; menunggu verifikasi.');

        $this->pmbEmailService->queueSubmitted($registration);

        return response()->json([
            'message' => 'Pendaftaran berhasil dikirim.',
            'data' => new PmbRegistrationResource($registration->fresh(['documents', 'events', 'messages.user'])),
        ]);
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        $registration = $this->ownedRegistration($request, $uuid);
        if ($registration === null) {
            return response()->json(['message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        return response()->json([
            'data' => new PmbRegistrationResource($registration->load(['documents', 'events.actor', 'messages.user'])),
        ]);
    }

    public function storeMessage(PortalMessagePmbRegistrationRequest $request, string $uuid): JsonResponse
    {
        $registration = $this->ownedRegistration($request, $uuid);
        if ($registration === null) {
            return response()->json(['message' => 'Pendaftaran tidak ditemukan.'], 404);
        }

        if (! in_array($registration->status, [
            PmbRegistration::STATUS_AWAITING_VERIFICATION,
            PmbRegistration::STATUS_NEEDS_REVISION,
            PmbRegistration::STATUS_ACCEPTED,
        ], true)) {
            return response()->json(['message' => 'Pesan hanya tersedia setelah pendaftaran dikirim.'], 422);
        }

        $message = PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $request->user()->id,
            'body' => $request->validated('body'),
            'media_id' => $request->validated('media_id'),
        ]);

        $this->recordEvent($registration, $request->user()->id, 'message', 'Pesan baru dari pendaftar.');
        $this->pmbRegistrationRepository->update($registration, []);

        return response()->json([
            'message' => 'Pesan terkirim.',
            'data' => [
                'id' => $message->id,
                'body' => $message->body,
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'role' => $request->user()->role,
                ],
                'created_at' => $message->created_at?->toIso8601String(),
            ],
        ], 201);
    }

    private function findOrCreateDraft(Request $request, int $schoolId): PmbRegistration
    {
        $user = $request->user();
        $existing = PmbRegistration::query()
            ->where('user_id', $user->id)
            ->where('status', PmbRegistration::STATUS_DRAFT)
            ->latest('id')
            ->first();

        if ($existing) {
            return $existing;
        }

        $active = PmbRegistration::query()
            ->where('user_id', $user->id)
            ->whereNotIn('status', [PmbRegistration::STATUS_DRAFT, PmbRegistration::STATUS_REJECTED])
            ->latest('id')
            ->first();

        if ($active) {
            return $active;
        }

        $activeYear = $this->resolveAcademicYear($schoolId);

        $registration = $this->pmbRegistrationRepository->create([
            'school_id' => $schoolId,
            'user_id' => $user->id,
            'status' => PmbRegistration::STATUS_DRAFT,
            'current_step' => 1,
            'student_name' => null,
            'parent_name' => null,
            'parent_phone' => null,
            'grade_applied' => null,
            'academic_year' => $activeYear,
            'draft_payload' => ['academic_year' => $activeYear],
        ]);

        $this->recordEvent($registration, $user->id, 'draft_created', 'Draft pendaftaran dibuat.');

        return $registration->fresh();
    }

    private function resolveSchoolId(Request $request): ?int
    {
        $requestedId = $request->input('school_id');
        if (is_numeric($requestedId) && (int) $requestedId > 0) {
            $id = School::query()
                ->whereKey((int) $requestedId)
                ->where('is_active', true)
                ->value('id');

            return $id ? (int) $id : null;
        }

        $id = School::query()
            ->where('slug', 'nurul-hikmah')
            ->where('is_active', true)
            ->value('id')
            ?? School::query()->where('is_active', true)->orderBy('id')->value('id');

        return $id ? (int) $id : null;
    }

    private function ownedRegistration(Request $request, string $uuid): ?PmbRegistration
    {
        return PmbRegistration::query()
            ->where('uuid', $uuid)
            ->where('user_id', $request->user()->id)
            ->first();
    }

    private function recordEvent(PmbRegistration $registration, ?int $actorId, string $type, string $message): void
    {
        PmbRegistrationEvent::query()->create([
            'pmb_registration_id' => $registration->id,
            'actor_user_id' => $actorId,
            'type' => $type,
            'message' => $message,
        ]);
    }

    private function resolveAcademicYear(int $schoolId): string
    {
        $active = $this->academicYearRepository->findActiveForSchool($schoolId);
        if ($active !== null) {
            return $active->label;
        }

        $now = now();
        $startYear = $now->month >= 7 ? $now->year : $now->year - 1;

        return "{$startYear}/".($startYear + 1);
    }

    /**
     * Resolve pmb_fee_uuid from request/draft/payment_info and attach fee snapshot.
     *
     * @param  array<string, mixed>  $data
     */
    private function applySelectedFee(
        array &$data,
        int $schoolId,
        bool $requireFee,
        ?PmbRegistration $existing = null,
    ): ?JsonResponse {
        $explicitFeeKey = array_key_exists('pmb_fee_uuid', $data)
            || array_key_exists('pmb_fee_uuid', $data['draft_payload'] ?? [])
            || array_key_exists('pmb_fee_uuid', $data['payment_info'] ?? []);

        $uuid = $data['pmb_fee_uuid']
            ?? ($data['draft_payload']['pmb_fee_uuid'] ?? null)
            ?? ($data['payment_info']['pmb_fee_uuid'] ?? null)
            ?? null;

        unset($data['pmb_fee_uuid']);

        if (! is_string($uuid) || $uuid === '') {
            if ($requireFee && empty($existing?->pmb_fee_id)) {
                return response()->json([
                    'message' => 'Pilih jenjang dan program biaya pendaftaran terlebih dahulu.',
                    'errors' => ['pmb_fee_uuid' => ['Pilih jenjang dan program biaya pendaftaran terlebih dahulu.']],
                ], 422);
            }

            // Draft explicitly cleared the fee (e.g. jenjang changed before picking program).
            if (! $requireFee && $explicitFeeKey) {
                $data['pmb_fee_id'] = null;
            }

            return null;
        }

        $fee = $this->pmbFeeRepository->findActiveByUuidForSchool($uuid, $schoolId);
        if ($fee === null) {
            return response()->json([
                'message' => 'Biaya pendaftaran tidak valid atau tidak aktif.',
                'errors' => ['pmb_fee_uuid' => ['Biaya pendaftaran tidak valid atau tidak aktif.']],
            ], 422);
        }

        $snapshot = $fee->toPaymentSnapshot();
        $data['pmb_fee_id'] = $fee->id;
        $data['grade_applied'] = $fee->gradeAppliedLabel();
        $data['payment_info'] = array_merge($data['payment_info'] ?? [], $snapshot);
        $data['draft_payload'] = array_merge($data['draft_payload'] ?? [], [
            'pmb_fee_uuid' => $fee->uuid,
            'jenjang' => $fee->jenjang,
            'program' => $fee->program,
            'fee_name' => $fee->name,
        ]);

        return null;
    }
}
