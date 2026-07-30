@extends('mail.pmb.layout')

@section('content')
    <p>Yth. Bapak/Ibu <strong>{{ $registration->parent_name ?? 'Orang Tua/Wali' }}</strong>,</p>

    <div style="white-space:pre-wrap;">{!! nl2br(e($body)) !!}</div>

    @if($registration->registration_number)
        <p style="margin-top:24px;font-size:13px;color:#6b7280;">
            Nomor registrasi: {{ $registration->registration_number }}
        </p>
    @endif
@endsection
