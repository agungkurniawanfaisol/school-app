export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface SocialMedia {
  facebook?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  twitter?: string
}

export interface SeoMeta {
  title?: string
  description?: string
  keywords?: string
}

export interface School {
  id: number
  name: string
  slug: string
  tagline: string | null
  description: string | null
  logo: string | null
  favicon: string | null
  about_image: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  map_embed_url: string | null
  vision: string | null
  mission: string | null
  social_media: SocialMedia | null
  seo: SeoMeta | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface HeroSlider {
  id: number
  school_id: number
  title: string
  subtitle: string | null
  image: string | null
  cta_text: string | null
  cta_url: string | null
  order: number
  is_active: boolean
}

export interface Curriculum {
  id: number
  school_id: number
  title: string
  slug: string
  excerpt: string | null
  content?: string | null
  content_json?: Record<string, unknown> | null
  icon: string | null
  thumbnail: string | null
  category: string | null
  order: number
  is_active: boolean
  is_featured: boolean
  created_at: string | null
}

export type TeacherType = 'kepala_sekolah' | 'guru' | 'staff' | 'pimpinan_yayasan'

export interface Teacher {
  id: number
  uuid: string
  school_id: number
  type: TeacherType
  name: string
  slug: string
  title: string | null
  subject: string | null
  bio?: string | null
  content?: string | null
  content_json?: Record<string, unknown> | null
  photo: string | null
  email?: string | null
  social_media: SocialMedia | null
  order: number
  is_active: boolean
  is_featured: boolean
  has_linked_user?: boolean
  created_at?: string | null
}

export interface StudentActivity {
  id: number
  uuid: string
  school_id: number
  title: string
  slug: string
  excerpt: string | null
  content?: string | null
  content_json?: Record<string, unknown> | null
  thumbnail: string | null
  category: string | null
  status?: string
  activity_date: string | null
  order: number
  is_active: boolean
  is_featured: boolean
  published_at: string | null
  created_at: string | null
}

export interface FacilityPhoto {
  id: number
  facility_id: number
  path: string
  url?: string
  caption: string | null
  order: number
  is_active: boolean
}

export interface Facility {
  id: number
  uuid: string
  school_id: number
  name: string
  slug: string
  description: string | null
  content?: string | null
  content_json?: Record<string, unknown> | null
  thumbnail: string | null
  category: string | null
  order: number
  is_active: boolean
  is_featured: boolean
  photos?: FacilityPhoto[]
  created_at?: string | null
}

export interface NewsAuthor {
  id: number
  name: string
}

export interface News {
  id: number
  uuid: string
  school_id: number
  title: string
  slug: string
  excerpt: string | null
  content?: string | null
  content_json?: Record<string, unknown> | null
  thumbnail: string | null
  category: string | null
  status?: string
  order: number
  is_active: boolean
  is_featured: boolean
  published_at: string | null
  publish_ends_at?: string | null
  display_status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'archived'
  author?: NewsAuthor
  created_at: string | null
}

export interface Testimonial {
  id: number
  school_id: number
  name: string
  role: string | null
  content: string
  photo: string | null
  rating: number | null
  order: number
  is_active: boolean
  is_featured: boolean
}

export interface SchoolValue {
  id: number
  uuid: string
  school_id: number
  icon: string | null
  title: string
  description: string
  order: number
  is_active: boolean
}

export interface SchoolStat {
  id: number
  uuid: string
  school_id: number
  icon: string | null
  label: string
  value: string
  order: number
  is_active: boolean
}

export interface CourseLesson {
  id: number
  course_module_id: number
  title: string
  slug: string
  type: string
  content?: string | null
  video_url?: string | null
  duration_minutes: number | null
  order: number
  is_active: boolean
  is_free_preview: boolean
}

export interface CourseModule {
  id: number
  course_id: number
  title: string
  slug: string
  description: string | null
  order: number
  is_active: boolean
  lessons?: CourseLesson[]
}

export interface Course {
  id: number
  school_id: number
  title: string
  slug: string
  excerpt: string | null
  description?: string | null
  thumbnail: string | null
  category: string | null
  level: string | null
  duration_minutes: number | null
  price: number | null
  status?: string
  order: number
  is_active: boolean
  is_featured: boolean
  published_at: string | null
  modules?: CourseModule[]
  created_at: string | null
}

export interface CourseEnrollment {
  id: number
  course_id: number
  student_name: string
  student_email: string
  status: 'active' | 'completed' | 'cancelled'
  enrolled_at: string | null
  completed_at: string | null
  course?: {
    id: number
    title: string
    slug: string
  }
}

export interface Media {
  id: number
  uuid: string
  filename: string
  original_name: string | null
  path: string
  disk: string
  mime_type: string | null
  size: number | null
  collection: string
  meta: Record<string, unknown> | null
  url: string | null
  created_at: string | null
}

export interface Setting {
  id: number
  school_id: number
  group: string
  key: string
  value: string | null
  type: string
}

export type PmbStatus =
  | 'draft'
  | 'awaiting_verification'
  | 'needs_revision'
  | 'accepted'
  | 'rejected'
  // Legacy (pre-simplify) — still accepted in some caches/tests during rollout
  | 'awaiting_payment_review'
  | 'submitted'
  | 'review'
  | 'pending'
  | 'paid'

export interface PmbEvent {
  id: number
  type: string
  message?: string | null
  actor?: { id: number; name: string; role: string } | null
  created_at?: string | null
}

export interface PmbMessage {
  id: number
  body: string
  media_id?: number | null
  user?: { id: number; name: string; role: string } | null
  sender_name?: string | null
  sender_role?: string | null
  created_at: string | null
}

export interface PmbRegistration {
  id: number
  uuid: string
  registration_number: string
  tracking_token?: string
  current_step?: number | null
  draft_payload?: Record<string, unknown> | null
  student_name: string | null
  birth_place: string | null
  birth_date: string | null
  gender: 'L' | 'P' | null
  parent_name: string
  parent_phone: string
  parent_email: string | null
  address: string | null
  previous_school: string | null
  grade_applied: string
  academic_year?: string | null
  status: PmbStatus
  status_label?: string | null
  status_description?: string | null
  notes?: string | null
  payment_info?: Record<string, unknown> | null
  student_photo?: {
    id: number
    uuid: string
    url: string | null
    mime_type: string | null
    original_name: string | null
  } | null
  loa_issued_at?: string | null
  loa_media_id?: number | null
  has_admin_unread?: boolean
  events?: PmbEvent[]
  messages?: PmbMessage[]
  created_at: string | null
  updated_at: string | null
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  teacher_id?: number | null
  avatar_url?: string | null
}

export type UserRole = 'admin' | 'guru' | 'admin_pmb' | 'pendaftar'

export interface AdminUser extends User {
  is_active: boolean
  teacher_id: number | null
  teacher?: {
    id: number
    name: string
    slug: string
    subject: string | null
    title: string | null
  } | null
  created_at: string | null
  updated_at: string | null
}

export interface ProfileData {
  user: User
  teacher: Teacher | null
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Faq {
  id: number
  school_id: number
  question: string
  answer: string
  category: 'pmb' | 'akademik' | 'biaya' | 'umum'
  is_active: boolean
  order: number
}

export interface Achievement {
  id: number
  uuid: string
  school_id: number
  title: string
  description: string | null
  category: 'akademik' | 'olahraga' | 'seni' | 'keagamaan' | 'lainnya'
  level: 'sekolah' | 'kecamatan' | 'kota' | 'provinsi' | 'nasional' | 'internasional'
  student_name: string | null
  year: number
  image: string | null
  is_active: boolean
  order: number
}

export interface Extracurricular {
  id: number
  uuid: string
  school_id: number
  name: string
  description: string | null
  category: 'olahraga' | 'seni' | 'akademik' | 'keagamaan' | 'lainnya'
  schedule: string | null
  instructor: string | null
  image: string | null
  is_active: boolean
  order: number
}

export interface Announcement {
  id: number
  uuid: string
  school_id: number
  title: string
  slug: string | null
  content: string
  priority: 'normal' | 'important' | 'urgent'
  is_pinned: boolean
  published_at: string | null
  expires_at: string | null
  is_active: boolean
  order: number
  cta_text: string | null
  cta_url: string | null
}

export interface Document {
  id: number
  school_id: number
  title: string
  description: string | null
  category: 'brosur' | 'formulir' | 'peraturan' | 'kalender' | 'lainnya'
  file_url: string
  file_size: number | null
  file_type: string | null
  download_count: number
  is_active: boolean
  order: number
}

export interface Event {
  id: number
  uuid: string
  school_id: number
  title: string
  description: string | null
  location: string | null
  event_date: string
  event_end_date: string | null
  event_time: string | null
  category: 'akademik' | 'keagamaan' | 'olahraga' | 'umum'
  is_active: boolean
  order: number
}

export interface PhotoAlbum {
  id: number
  uuid: string
  school_id: number
  title: string
  slug: string | null
  description: string | null
  cover_image: string | null
  event_date: string | null
  is_active: boolean
  order: number
  photos?: AlbumPhoto[]
  photos_count?: number
}

export interface AlbumPhoto {
  id: number
  photo_album_id: number
  url: string
  caption: string | null
  order: number
}

export interface ContactMessage {
  id: number
  school_id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  read_at: string | null
  replied_at: string | null
  created_at: string | null
}

export interface ListFilters {
  page?: number
  per_page?: number
  search?: string
  category?: string
  featured?: boolean
  school_id?: number
  status?: string
  academic_year?: string
  display_status?: string
  group?: string
  is_active?: boolean
  is_featured?: boolean
  type?: string
  grade_applied?: string
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

export interface PmbRegistrationStats {
  totals: {
    all: number
    by_status: Record<string, number>
  }
  by_grade: Array<{ grade: string; count: number }>
  by_gender: Array<{ gender: string; count: number }>
  by_month: Array<{ year: number; month: number; count: number }>
  top_previous_schools: Array<{ name: string; count: number }>
}

export type PmbNotificationType =
  | 'message'
  | 'payment_verified'
  | 'payment_rejected'
  | 'status_changed'
  | 'loa_issued'
  | string

export interface PmbNotificationItem {
  id: string
  source: 'message' | 'event'
  source_id: number
  type: PmbNotificationType
  title: string
  body: string
  registration_uuid: string | null
  href_hash: string | null
  unread: boolean
  created_at: string | null
}

export interface PmbNotificationsPayload {
  unread_count: number
  items: PmbNotificationItem[]
}
