@extends('mail.pmb.layout')

@section('content')
    <p>Yth. Bapak/Ibu <strong>{{ $registration->parent_name ?? 'Orang Tua/Wali' }}</strong>,</p>

    <p>
        Dengan senang hati kami sampaikan bahwa pendaftaran atas nama
        <strong>{{ $registration->student_name }}</strong>
        ({{ $registration->registration_number }}) telah <strong>DITERIMA</strong>.
    </p>

    @if (! empty($adminNote))
        <p style="margin:20px 0;padding:14px 16px;background:#f9fafb;border-left:4px solid #15803d;border-radius:4px;">
            <strong>Catatan dari panitia:</strong><br>
            {{ $adminNote }}
        </p>
    @endif

    <p>
        Silakan masuk ke portal PMB untuk melihat surat penerimaan (LoA) dan formulir pendaftaran:
    </p>

    <p style="margin:24px 0;">
        <a href="{{ $portalUrl }}" style="display:inline-block;padding:12px 20px;background:#15803d;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
            Buka Portal PMB
        </a>
    </p>

    <p>Selamat bergabung di keluarga besar {{ config('app.name') }}.</p>
@endsection
