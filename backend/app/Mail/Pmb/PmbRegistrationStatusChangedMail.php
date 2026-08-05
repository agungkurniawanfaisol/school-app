<?php

namespace App\Mail\Pmb;

use App\Models\PmbRegistration;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PmbRegistrationStatusChangedMail extends Mailable
{
    use SerializesModels;

    public function __construct(
        public PmbRegistration $registration,
        public ?string $adminNote = null,
    ) {}

    public function envelope(): Envelope
    {
        $label = PmbRegistration::STATUS_LABELS[$this->registration->status]
            ?? $this->registration->status;

        return new Envelope(
            subject: 'Update status PMB ('.$label.') — '.$this->registration->registration_number,
        );
    }

    public function content(): Content
    {
        $label = PmbRegistration::STATUS_LABELS[$this->registration->status]
            ?? $this->registration->status;
        $description = PmbRegistration::STATUS_DESCRIPTIONS[$this->registration->status] ?? null;

        return new Content(
            view: 'mail.pmb.status_changed',
            with: [
                'registration' => $this->registration,
                'statusLabel' => $label,
                'statusDescription' => $description,
                'adminNote' => $this->adminNote,
                'portalUrl' => rtrim((string) config('services.google.frontend_url', config('app.url')), '/').'/pmb/portal',
            ],
        );
    }
}
