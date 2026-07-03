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
  icon: string | null
  thumbnail: string | null
  category: string | null
  order: number
  is_active: boolean
  is_featured: boolean
  created_at: string | null
}

export interface Teacher {
  id: number
  uuid: string
  school_id: number
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

export type PmbStatus = 'pending' | 'review' | 'accepted' | 'rejected' | 'paid'

export interface PmbRegistration {
  id: number
  registration_number: string
  tracking_token?: string
  student_name: string
  birth_place: string | null
  birth_date: string | null
  gender: 'L' | 'P' | null
  parent_name: string
  parent_phone: string
  parent_email: string | null
  address: string | null
  previous_school: string | null
  grade_applied: string
  status: PmbStatus
  notes?: string | null
  payment_info?: Record<string, unknown> | null
  created_at: string | null
  updated_at: string | null
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  teacher_id?: number | null
}

export type UserRole = 'admin' | 'guru'

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

export interface ListFilters {
  page?: number
  per_page?: number
  search?: string
  category?: string
  featured?: boolean
  school_id?: number
  status?: string
  group?: string
  is_active?: boolean
  is_featured?: boolean
}
