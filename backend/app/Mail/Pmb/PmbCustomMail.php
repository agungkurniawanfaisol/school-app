<?php

namespace App\Mail\Pmb;

use App\Models\PmbRegistration;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PmbCustomMail extends Mailable
{
    use SerializesModels;

    public function __construct(
        public PmbRegistration $registration,
        public string $mailSubject,
        public string $body,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->mailSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.pmb.custom',
            with: [
                'registration' => $this->registration,
                'body' => $this->body,
            ],
        );
    }
}
