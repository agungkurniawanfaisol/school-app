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
  school_id: number
  name: string
  slug: string
  title: string | null
  subject: string | null
  bio?: string | null
  photo: string | null
  email?: string | null
  social_media: SocialMedia | null
  order: number
  is_active: boolean
  is_featured: boolean
}

export interface StudentActivity {
  id: number
  school_id: number
  title: string
  slug: string
  excerpt: string | null
  content?: string | null
  thumbnail: string | null
  category: string | null
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
  caption: string | null
  order: number
  is_active: boolean
}

export interface Facility {
  id: number
  school_id: number
  name: string
  slug: string
  description: string | null
  thumbnail: string | null
  category: string | null
  order: number
  is_active: boolean
  is_featured: boolean
  photos?: FacilityPhoto[]
}

export interface NewsAuthor {
  id: number
  name: string
}

export interface News {
  id: number
  school_id: number
  title: string
  slug: string
  excerpt: string | null
  content?: string | null
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
  role: string
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
}
