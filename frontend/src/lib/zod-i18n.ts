import type { TFunction } from 'i18next'

export type AdminTFunction = TFunction<'admin'>

const ID_VALIDATION_DEFAULTS: Record<string, string> = {
  'validation.required': 'Wajib diisi',
  'validation.titleRequired': 'Judul wajib diisi',
  'validation.nameRequired': 'Nama wajib diisi',
  'validation.schoolRequired': 'Sekolah wajib dipilih',
  'validation.schoolNameRequired': 'Nama sekolah wajib diisi',
  'validation.contentRequired': 'Konten wajib diisi',
  'validation.passwordRequired': 'Kata sandi wajib diisi',
  'validation.passwordConfirmRequired': 'Konfirmasi kata sandi wajib diisi',
  'validation.emailInvalid': 'Email tidak valid',
  'validation.urlInvalid': 'URL tidak valid',
  'validation.questionRequired': 'Pertanyaan wajib diisi',
  'validation.answerRequired': 'Jawaban wajib diisi',
  'validation.subjectRequired': 'Subjek wajib diisi',
  'validation.messageRequired': 'Pesan wajib diisi',
  'validation.fileRequired': 'File wajib diunggah',
  'validation.imageRequired': 'Gambar wajib diisi',
  'validation.photoUrlRequired': 'URL foto wajib diisi',
  'validation.facilityNameRequired': 'Nama fasilitas wajib diisi',
  'validation.studentNameRequired': 'Nama siswa wajib diisi',
  'validation.parentNameRequired': 'Nama orang tua wajib diisi',
  'validation.phoneRequired': 'Nomor telepon wajib diisi',
  'validation.gradeRequired': 'Jenjang pendaftaran wajib diisi',
  'validation.tokenRequired': 'Token pelacakan wajib diisi',
  'validation.groupRequired': 'Grup wajib diisi',
  'validation.keyRequired': 'Kunci wajib diisi',
  'validation.courseRequired': 'Kursus wajib dipilih',
  'validation.moduleRequired': 'Modul wajib dipilih',
  'validation.testimonialContentRequired': 'Isi testimoni wajib diisi',
  'validation.eventDateRequired': 'Tanggal acara wajib diisi',
  'validation.locationNameRequired': 'Nama lokasi wajib diisi',
  'validation.pinLabelRequired': 'Label pin wajib diisi',
  'validation.panoramaRequired': 'Gambar panorama wajib diunggah',
  'validation.passwordMismatch': 'Kata sandi tidak cocok',
  'validation.minLength': 'Minimal {{min}} karakter',
  'validation.maxLength': 'Maksimal {{max}} karakter',
  'validation.targetSceneRequired': 'Pilih lokasi tujuan',
  'validation.minOnePanorama': 'Minimal satu panorama',
  'validation.endAfterStart': 'Waktu berakhir harus setelah waktu mulai.',
  'validation.invalidStartTime': 'Waktu mulai tidak valid.',
}

function interpolate(template: string, options?: Record<string, unknown>): string {
  if (!options) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(options[key] ?? ''))
}

export function createDefaultAdminT(overrides: Record<string, string> = {}): AdminTFunction {
  const messages = { ...ID_VALIDATION_DEFAULTS, ...overrides }
  return ((key: string, options?: Record<string, unknown>) =>
    interpolate(messages[key] ?? key, options)) as AdminTFunction
}

export const defaultAdminT = createDefaultAdminT()
