<?php

namespace App\Jobs;

use App\Mail\Pmb\PmbCustomMail;
use App\Mail\Pmb\PmbRegistrationAcceptedMail;
use App\Mail\Pmb\PmbRegistrationSubmittedMail;
use App\Models\PmbEmailLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class SendPmbEmailJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public int $logId) {}

    public function handle(): void
    {
        $log = PmbEmailLog::query()->with('registration')->find($this->logId);

        if ($log === null || $log->status !== PmbEmailLog::STATUS_QUEUED) {
            return;
        }

        if ($log->recipient_email === null || $log->registration === null) {
            $log->update([
                'status' => PmbEmailLog::STATUS_SKIPPED,
                'error_message' => 'Penerima atau data pendaftaran tidak tersedia.',
            ]);

            return;
        }

        try {
            $mailable = match ($log->type) {
                PmbEmailLog::TYPE_SUBMITTED => new PmbRegistrationSubmittedMail($log->registration),
                PmbEmailLog::TYPE_ACCEPTED => new PmbRegistrationAcceptedMail($log->registration),
                PmbEmailLog::TYPE_CUSTOM, PmbEmailLog::TYPE_BROADCAST => new PmbCustomMail(
                    $log->registration,
                    $log->subject,
                    (string) $log->body,
                ),
                default => throw new \InvalidArgumentException('Tipe email tidak dikenal: '.$log->type),
            };

            Mail::to($log->recipient_email)->send($mailable);

            $log->update([
                'status' => PmbEmailLog::STATUS_SENT,
                'sent_at' => now(),
                'error_message' => null,
            ]);
        } catch (Throwable $exception) {
            $log->update([
                'status' => PmbEmailLog::STATUS_FAILED,
                'error_message' => Str::limit($exception->getMessage(), 500),
            ]);

            throw $exception;
        }
    }
}
