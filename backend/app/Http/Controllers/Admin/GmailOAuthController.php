<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Gmail\SendGmailTestRequest;
use App\Mail\GmailTestMail;
use App\Services\GmailOAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class GmailOAuthController extends Controller
{
    public function __construct(private GmailOAuthService $gmailOAuth) {}

    public function status(): JsonResponse
    {
        return response()->json(['data' => $this->gmailOAuth->status()]);
    }

    public function sendTest(SendGmailTestRequest $request): JsonResponse
    {
        if (! $this->gmailOAuth->isReadyToSend()) {
            return response()->json([
                'message' => 'Gmail belum siap mengirim. Hubungkan akun Gmail terlebih dahulu.',
            ], 422);
        }

        $data = $request->validated();

        try {
            Mail::to($data['to'])->send(new GmailTestMail($data['subject'], $data['body']));
        } catch (Throwable $exception) {
            return response()->json([
                'message' => 'Gagal mengirim email uji: '.$exception->getMessage(),
            ], 422);
        }

        return response()->json([
            'message' => 'Email uji berhasil dikirim.',
        ]);
    }

    public function redirect(): JsonResponse|RedirectResponse
    {
        try {
            $url = $this->gmailOAuth->authorizationUrl();
        } catch (Throwable $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        if (request()->expectsJson() && ! request()->boolean('browser')) {
            return response()->json(['data' => ['url' => $url]]);
        }

        return redirect()->away($url);
    }

    public function callback(Request $request): RedirectResponse
    {
        $frontend = rtrim((string) config('services.google.frontend_url', config('app.url')), '/');
        $target = $frontend.'/admin/settings';

        try {
            $result = $this->gmailOAuth->handleCallback(
                (string) $request->query('code', ''),
                $request->query('state'),
            );

            $query = http_build_query([
                'gmail' => 'connected',
                'email' => $result['email'] ?? '',
            ]);

            return redirect()->away($target.'?'.$query);
        } catch (Throwable $exception) {
            $query = http_build_query([
                'gmail' => 'error',
                'message' => $exception->getMessage(),
            ]);

            return redirect()->away($target.'?'.$query);
        }
    }

    public function disconnect(): JsonResponse
    {
        $this->gmailOAuth->disconnect();

        return response()->json([
            'message' => 'Koneksi Gmail OAuth diputus. Hapus juga GOOGLE_GMAIL_REFRESH_TOKEN dari .env jika ada.',
            'data' => $this->gmailOAuth->status(),
        ]);
    }
}
