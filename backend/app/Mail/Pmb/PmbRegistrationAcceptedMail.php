<?php

namespace App\Mail\Pmb;

use App\Models\PmbRegistration;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PmbRegistrationAcceptedMail extends Mailable
{
    use SerializesModels;

    public function __construct(public PmbRegistration $registration) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Selamat — Pendaftaran diterima ('.$this->registration->registration_number.')',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.pmb.accepted',
            with: [
                'registration' => $this->registration,
                'portalUrl' => rtrim((string) config('services.frontend_url', config('app.url')), '/').'/pmb/portal',
            ],
        );
    }
}
