<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $subject ?? config('app.name') }}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                <tr>
                    <td style="padding:24px 28px;background:#0f4c3a;color:#ffffff;">
                        <h1 style="margin:0;font-size:20px;font-weight:700;">{{ config('mail.from.name', config('app.name')) }}</h1>
                        <p style="margin:8px 0 0;font-size:13px;opacity:0.9;">Penerimaan Mahasiswa Baru (PMB)</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:28px;font-size:15px;line-height:1.6;">
                        @yield('content')
                    </td>
                </tr>
                <tr>
                    <td style="padding:16px 28px;background:#f9fafb;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
                        Email ini dikirim otomatis. Mohon tidak membalas langsung ke alamat ini.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
