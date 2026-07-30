<?php

namespace App\Services;

use App\Jobs\SendPmbEmailJob;
use App\Models\PmbEmailLog;
use App\Models\PmbRegistration;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PmbEmailService
{
    /**
     * @return array{queued: int, skipped: int}
     */
    public function queueSubmitted(PmbRegistration $registration): array
    {
        $subject = 'Konfirmasi pendaftaran PMB — '.$registration->registration_number;

        return $this->queueForRegistration(
            $registration,
            PmbEmailLog::TYPE_SUBMITTED,
            $subject,
        );
    }

    /**
     * @return array{queued: int, skipped: int}
     */
    public function queueAccepted(PmbRegistration $registration): array
    {
        if ($this->hasSentAcceptedEmail($registration)) {
            return ['queued' => 0, 'skipped' => 0];
        }

        $subject = 'Selamat — Pendaftaran diterima ('.$registration->registration_number.')';

        return $this->queueForRegistration(
            $registration,
            PmbEmailLog::TYPE_ACCEPTED,
            $subject,
        );
    }

    /**
     * @param  list<string>  $registrationUuids
     * @return array{queued: int, skipped: int}
     */
    public function queueCustom(array $registrationUuids, string $subject, string $body): array
    {
        $registrations = PmbRegistration::query()
            ->whereIn('uuid', $registrationUuids)
            ->get();

        return $this->queueCustomForRegistrations($registrations, $subject, $body, PmbEmailLog::TYPE_CUSTOM);
    }

    /**
     * @return array{queued: int, skipped: int}
     */
    public function queueBroadcast(?string $status, string $subject, string $body): array
    {
        $query = PmbRegistration::query()
            ->whereNotNull('parent_email')
            ->where('parent_email', '!=', '');

        if ($status !== null && $status !== 'all') {
            $query->where('status', $status);
        }

        return $this->queueCustomForRegistrations($query->get(), $subject, $body, PmbEmailLog::TYPE_BROADCAST);
    }

    public function personalizeBody(PmbRegistration $registration, string $body): string
    {
        return str_replace(
            ['{student_name}', '{registration_number}', '{parent_name}'],
            [
                (string) ($registration->student_name ?? ''),
                (string) ($registration->registration_number ?? ''),
                (string) ($registration->parent_name ?? ''),
            ],
            $body,
        );
    }

    private function hasSentAcceptedEmail(PmbRegistration $registration): bool
    {
        return PmbEmailLog::query()
            ->where('pmb_registration_id', $registration->id)
            ->where('type', PmbEmailLog::TYPE_ACCEPTED)
            ->where('status', PmbEmailLog::STATUS_SENT)
            ->exists();
    }

    /**
     * @return array{queued: int, skipped: int}
     */
    private function queueForRegistration(PmbRegistration $registration, string $type, string $subject, ?string $body = null): array
    {
        $recipient = $this->resolveRecipient($registration);

        if ($recipient === null) {
            PmbEmailLog::query()->create([
                'pmb_registration_id' => $registration->id,
                'type' => $type,
                'recipient_email' => null,
                'subject' => $subject,
                'body' => $body,
                'status' => PmbEmailLog::STATUS_SKIPPED,
            ]);

            return ['queued' => 0, 'skipped' => 1];
        }

        $log = PmbEmailLog::query()->create([
            'pmb_registration_id' => $registration->id,
            'type' => $type,
            'recipient_email' => $recipient,
            'subject' => $subject,
            'body' => $body,
            'status' => PmbEmailLog::STATUS_QUEUED,
        ]);

        SendPmbEmailJob::dispatch($log->id);

        return ['queued' => 1, 'skipped' => 0];
    }

    /**
     * @param  Collection<int, PmbRegistration>  $registrations
     * @return array{queued: int, skipped: int}
     */
    private function queueCustomForRegistrations(Collection $registrations, string $subject, string $body, string $type): array
    {
        $queued = 0;
        $skipped = 0;

        foreach ($registrations as $registration) {
            $personalizedBody = $this->personalizeBody($registration, $body);
            $result = $this->queueForRegistration($registration, $type, $subject, $personalizedBody);
            $queued += $result['queued'];
            $skipped += $result['skipped'];
        }

        return ['queued' => $queued, 'skipped' => $skipped];
    }

    private function resolveRecipient(PmbRegistration $registration): ?string
    {
        $email = Str::lower(trim((string) $registration->parent_email));

        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return null;
        }

        return $email;
    }
}
