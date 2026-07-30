<?php

namespace App\Mail\Transport;

use App\Services\GmailOAuthService;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\MessageConverter;

class GmailApiTransport extends AbstractTransport
{
    public function __construct(private GmailOAuthService $gmailOAuth)
    {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());
        $this->gmailOAuth->sendRawMime($email->toString());
    }

    public function __toString(): string
    {
        return 'gmail-api';
    }
}
