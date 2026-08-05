<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesCrud;
use App\Http\Controllers\Controller;
use App\Http\Requests\PmbRegistration\AdminMarkNotificationsReadRequest;
use App\Http\Requests\PmbRegistration\AdminUpdatePmbPortalRequest;
use App\Http\Requests\PmbRegistration\PmbRegistrationAnalyticsRequest;
use App\Http\Requests\PmbRegistration\PortalMessagePmbRegistrationRequest;
use App\Http\Requests\PmbRegistration\StorePmbRegistrationRequest;
use App\Http\Requests\PmbRegistration\UpdatePmbRegistrationRequest;
use App\Http\Resources\V1\PmbRegistrationResource;
use App\Http\Resources\V1\PmbRegistrationStatsResource;
use App\Models\PmbRegistration;
use App\Models\PmbRegistrationEvent;
use App\Models\PmbRegistrationMessage;
use App\Repositories\BaseRepository;
use App\Repositories\PmbRegistrationRepository;
use App\Services\PmbEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PmbRegistrationController extends Controller
{
    use HandlesCrud;

    public function __construct(
        private PmbRegistrationRepository $pmbRegistrationRepository,
        private PmbEmailService $pmbEmailService,
    ) {}

    protected function repository(): BaseRepository
    {
        return $this->pmbRegistrationRepository;
    }

    protected function resourceClass(): string
    {
        return PmbRegistrationResource::class;
    }

    public function stats(PmbRegistrationAnalyticsRequest $request): JsonResponse
    {
        $stats = $this->pmbRegistrationRepository->getStats($request->filters());

        return response()->json([
            'data' => (new PmbRegistrationStatsResource($stats))->resolve(),
        ]);
    }

    public function notifications(): JsonResponse
    {
        $payload = $this->pmbRegistrationRepository->getNotificationsForAdmin();

        return response()->json(['data' => $payload]);
    }

    public function markNotificationsRead(AdminMarkNotificationsReadRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $payload = $this->pmbRegistrationRepository->markAdminNotificationsRead(
            all: (bool) ($validated['all'] ?? false),
            messageIds: array_map('intval', $validated['message_ids'] ?? []),
            registrationUuid: $validated['registration_uuid'] ?? null,
        );

        return response()->json([
            'message' => 'Notifikasi ditandai dibaca.',
            'data' => $payload,
        ]);
    }

    public function export(PmbRegistrationAnalyticsRequest $request): StreamedResponse|JsonResponse
    {
        $rows = $this->pmbRegistrationRepository->getForExport($request->filters());
        $filename = 'pmb-registrations-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($rows): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            // UTF-8 BOM so Excel opens Indonesian text correctly
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'uuid',
                'registration_number',
                'student_name',
                'academic_year',
                'grade_applied',
                'status',
                'gender',
                'parent_name',
                'parent_phone',
                'parent_email',
                'previous_school',
                'created_at',
                'loa_issued',
            ]);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row->uuid,
                    $row->registration_number,
                    $row->student_name,
                    $row->academic_year,
                    $row->grade_applied,
                    $row->status,
                    $row->gender,
                    $row->parent_name,
                    $row->parent_phone,
                    $row->parent_email,
                    $row->previous_school,
                    $row->created_at?->toDateTimeString(),
                    $row->loa_issued_at ? 'ya' : 'tidak',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function store(StorePmbRegistrationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tracking_token'] = Str::random(64);
        $data['status'] = $data['status'] ?? PmbRegistration::STATUS_AWAITING_VERIFICATION;

        $item = $this->pmbRegistrationRepository->create($data);

        return response()->json([
            'message' => 'Data berhasil ditambahkan.',
            'data' => new PmbRegistrationResource($item),
        ], 201);
    }

    public function update(UpdatePmbRegistrationRequest $request, int $id): JsonResponse
    {
        return $this->performUpdate($request, $id);
    }

    public function showByUuid(string $uuid): JsonResponse
    {
        $registration = PmbRegistration::query()->where('uuid', $uuid)->first();
        if ($registration === null) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $this->pmbRegistrationRepository->markAdminNotificationsRead(
            registrationUuid: $uuid,
        );

        $registration = $registration->fresh()->load(['documents', 'events.actor', 'messages.user', 'user']);

        return response()->json([
            'data' => new PmbRegistrationResource($registration),
        ]);
    }

    public function updateByUuid(AdminUpdatePmbPortalRequest $request, string $uuid): JsonResponse
    {
        $registration = PmbRegistration::query()->where('uuid', $uuid)->first();
        if ($registration === null) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $data = $request->validated();
        $actorId = $request->user()->id;

        if (! empty($data['verify_payment'])) {
            $payment = $registration->payment_info ?? [];
            $payment['verified_at'] = now()->toIso8601String();
            $payment['verified_by'] = $actorId;
            unset($payment['rejection_reason']);
            $data['payment_info'] = $payment;
            $data['status'] = PmbRegistration::STATUS_AWAITING_VERIFICATION;
            $this->recordEvent($registration, $actorId, 'payment_verified', 'Bukti pembayaran diverifikasi.');
        }

        if (! empty($data['reject_payment'])) {
            $payment = $registration->payment_info ?? [];
            $payment['rejection_reason'] = $data['payment_rejection_reason'] ?? 'Bukti pembayaran ditolak.';
            unset($payment['verified_at'], $payment['verified_by']);
            $data['payment_info'] = $payment;
            // Allow pendaftar to fix proof/data.
            $data['status'] = PmbRegistration::STATUS_NEEDS_REVISION;
            $this->recordEvent($registration, $actorId, 'payment_rejected', $payment['rejection_reason']);
        }

        if (! empty($data['issue_loa'])) {
            if ($registration->status !== PmbRegistration::STATUS_ACCEPTED && ($data['status'] ?? null) !== PmbRegistration::STATUS_ACCEPTED) {
                return response()->json(['message' => 'LoA hanya dapat diterbitkan setelah diterima.'], 422);
            }
            $data['status'] = PmbRegistration::STATUS_ACCEPTED;
            $data['loa_issued_at'] = now();
            $this->recordEvent($registration, $actorId, 'loa_issued', 'LoA diterbitkan (placeholder).');
        }

        if (isset($data['status']) && $data['status'] !== $registration->status) {
            $label = PmbRegistration::STATUS_LABELS[$data['status']] ?? $data['status'];
            $this->recordEvent($registration, $actorId, 'status_changed', 'Status diubah menjadi '.$label.'.');
        }

        $previousStatus = $registration->status;
        $previousNotes = $registration->notes;
        $incomingNotes = array_key_exists('notes', $data) ? $data['notes'] : null;
        $shouldNotifyPendaftar = array_key_exists('notes', $data)
            && is_string($incomingNotes)
            && trim($incomingNotes) !== ''
            && trim($incomingNotes) !== trim((string) ($previousNotes ?? ''));

        unset($data['verify_payment'], $data['reject_payment'], $data['payment_rejection_reason'], $data['issue_loa']);

        // One-shot composer: after sending as a message, do not keep notes on the registration.
        if ($shouldNotifyPendaftar) {
            $data['notes'] = null;
        }

        $registration = $this->pmbRegistrationRepository->update($registration, $data);

        if ($registration->status !== $previousStatus) {
            $noteForEmail = $shouldNotifyPendaftar ? trim((string) $incomingNotes) : null;
            $this->pmbEmailService->queueStatusChanged($registration, $previousStatus, $noteForEmail);
        }

        if ($shouldNotifyPendaftar) {
            PmbRegistrationMessage::query()->create([
                'pmb_registration_id' => $registration->id,
                'user_id' => $actorId,
                'body' => trim((string) $incomingNotes),
                'media_id' => null,
            ]);

            $this->recordEvent($registration, $actorId, 'message', 'Pesan baru dari catatan admin.');
        }

        return response()->json([
            'message' => 'Data berhasil diperbarui.',
            'data' => new PmbRegistrationResource($registration->load(['documents', 'events.actor', 'messages.user', 'user'])),
        ]);
    }

    public function storeMessage(PortalMessagePmbRegistrationRequest $request, string $uuid): JsonResponse
    {
        $registration = PmbRegistration::query()->where('uuid', $uuid)->first();
        if ($registration === null) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $message = PmbRegistrationMessage::query()->create([
            'pmb_registration_id' => $registration->id,
            'user_id' => $request->user()->id,
            'body' => $request->validated('body'),
            'media_id' => $request->validated('media_id'),
        ]);

        $this->recordEvent($registration, $request->user()->id, 'message', 'Pesan baru dari admin PMB.');
        $this->pmbRegistrationRepository->update($registration, []);

        return response()->json([
            'message' => 'Pesan terkirim.',
            'data' => [
                'id' => $message->id,
                'body' => $message->body,
                'created_at' => $message->created_at?->toIso8601String(),
            ],
        ], 201);
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
}
