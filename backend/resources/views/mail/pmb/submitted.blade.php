@extends('mail.pmb.layout')

@section('content')
    <p>Yth. Bapak/Ibu <strong>{{ $registration->parent_name ?? 'Orang Tua/Wali' }}</strong>,</p>

    <p>
        Pendaftaran PMB atas nama <strong>{{ $registration->student_name }}</strong>
        telah berhasil dikirim dengan nomor registrasi
        <strong>{{ $registration->registration_number }}</strong>.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;margin:16px 0;background:#f9fafb;border-radius:8px;">
        <tr>
            <td style="padding:12px 16px;font-size:14px;">
                <div><strong>Jenjang:</strong> {{ $registration->grade_applied ?? '—' }}</div>
                <div><strong>Tahun ajaran:</strong> {{ $registration->academic_year ?? '—' }}</div>
            </td>
        </tr>
    </table>

    <p>
        Tim admin akan memverifikasi data dan bukti pembayaran Anda.
        Pantau status pendaftaran melalui portal PMB:
    </p>

    <p style="margin:24px 0;">
        <a href="{{ $portalUrl }}" style="display:inline-block;padding:12px 20px;background:#0f4c3a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
            Buka Portal PMB
        </a>
    </p>

    <p>Terima kasih atas kepercayaan Anda.</p>
@endsection
