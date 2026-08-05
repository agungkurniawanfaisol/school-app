@extends('mail.pmb.layout')

@section('content')
    <p>Yth. Bapak/Ibu <strong>{{ $registration->parent_name ?? 'Orang Tua/Wali' }}</strong>,</p>

    <p>
        Status pendaftaran atas nama
        <strong>{{ $registration->student_name }}</strong>
        ({{ $registration->registration_number }}) telah diperbarui menjadi
        <strong>{{ $statusLabel }}</strong>.
    </p>

    @if (! empty($statusDescription))
        <p>{{ $statusDescription }}</p>
    @endif

    @if (! empty($adminNote))
        <p style="margin:20px 0;padding:14px 16px;background:#f9fafb;border-left:4px solid #0f4c3a;border-radius:4px;">
            <strong>Catatan dari panitia:</strong><br>
            {{ $adminNote }}
        </p>
    @endif

    <p>Silakan masuk ke portal PMB untuk melihat detail dan menindaklanjuti jika diperlukan:</p>

    <p style="margin:24px 0;">
        <a href="{{ $portalUrl }}" style="display:inline-block;padding:12px 20px;background:#0f4c3a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
            Buka Portal PMB
        </a>
    </p>
@endsection
