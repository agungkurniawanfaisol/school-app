import { useEffect, useState } from 'react'
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { api, SCHOOL_SLUG } from '@/lib/api'
import { queryConfig, buildQueryParams } from '@/hooks/queryConfig'
import { achievementKeys, type Achievement } from '@/hooks/useAchievements'
import { activityKeys } from '@/hooks/useActivities'
import { curriculumKeys } from '@/hooks/useCurriculums'
import { documentKeys } from '@/hooks/useDocuments'
import { eventKeys, type Event } from '@/hooks/useEvents'
import { facilityKeys } from '@/hooks/useFacilities'
import { newsKeys } from '@/hooks/useNews'
import { photoAlbumKeys } from '@/hooks/usePhotoAlbums'
import { schoolKeys } from '@/hooks/useSchool'
import { schoolStatKeys } from '@/hooks/useSchoolStats'
import { schoolValueKeys } from '@/hooks/useSchoolValues'
import { teacherKeys } from '@/hooks/useTeachers'
import { testimonialKeys } from '@/hooks/useTestimonials'
import type {
  Curriculum,
  Document,
  Facility,
  HeroSlider,
  News,
  PaginatedResponse,
  PhotoAlbum,
  School,
  SchoolStat,
  SchoolValue,
  StudentActivity,
  Teacher,
  Testimonial,
} from '@/types'

interface LandingData {
  school: School | null
  hero_sliders: HeroSlider[]
  curriculums: Curriculum[]
  teachers: Teacher[]
  principal: Teacher[]
  foundation_board: Teacher[]
  staff: Teacher[]
  activities: StudentActivity[]
  achievements: Achievement[]
  events: Event[]
  documents: Document[]
  photo_albums: PhotoAlbum[]
  facilities: Facility[]
  /** Full facilities count for landing gallery load-more (optional; falls back to page length). */
  facilities_total?: number
  news: News[]
  testimonials: Testimonial[]
  school_values: SchoolValue[]
  school_stats: SchoolStat[]
}

const LANDING_KEY = ['landing'] as const

function wrapPaginated<T>(items: T[], perPage: number, total?: number): PaginatedResponse<T> {
  const resolvedTotal = total ?? items.length
  return {
    data: items,
    meta: {
      current_page: 1,
      from: items.length > 0 ? 1 : null,
      last_page: Math.max(1, Math.ceil(resolvedTotal / perPage)),
      path: '',
      per_page: perPage,
      to: items.length > 0 ? items.length : null,
      total: resolvedTotal,
    },
    links: { first: null, last: null, prev: null, next: null },
  }
}

function seedSectionCaches(qc: QueryClient, data: LandingData): void {
  if (data.school) {
    qc.setQueryData(schoolKeys.detail(SCHOOL_SLUG), data.school)
  }
  qc.setQueryData(['hero-sliders'], data.hero_sliders)
  qc.setQueryData(
    teacherKeys.list(buildQueryParams({ per_page: 7, type: 'guru' })),
    wrapPaginated(data.teachers, 7),
  )
  qc.setQueryData(
    teacherKeys.list(buildQueryParams({ type: 'kepala_sekolah', per_page: 1 })),
    wrapPaginated(data.principal, 1),
  )
  qc.setQueryData(
    teacherKeys.list(buildQueryParams({ type: 'pimpinan_yayasan', per_page: 4 })),
    wrapPaginated(data.foundation_board ?? [], 4),
  )
  qc.setQueryData(
    teacherKeys.list(buildQueryParams({ type: 'staff', per_page: 12 })),
    wrapPaginated(data.staff, 12),
  )
  qc.setQueryData(
    curriculumKeys.list(buildQueryParams({ per_page: 6, featured: true })),
    wrapPaginated(data.curriculums, 6),
  )
  qc.setQueryData(
    activityKeys.list(buildQueryParams({ per_page: 6, featured: true })),
    wrapPaginated(data.activities, 6),
  )
  qc.setQueryData(
    achievementKeys.list(buildQueryParams({ per_page: 6 })),
    wrapPaginated(data.achievements, 6),
  )
  qc.setQueryData(
    facilityKeys.list(buildQueryParams({ per_page: 8 })),
    wrapPaginated(data.facilities, 8, data.facilities_total),
  )
  qc.setQueryData(
    eventKeys.list(buildQueryParams({ per_page: 5 })),
    wrapPaginated(data.events, 5),
  )
  qc.setQueryData(
    documentKeys.list(buildQueryParams({ per_page: 6 })),
    wrapPaginated(data.documents, 6),
  )
  qc.setQueryData(
    photoAlbumKeys.list(buildQueryParams({ per_page: 4 })),
    wrapPaginated(data.photo_albums, 4),
  )
  qc.setQueryData(
    newsKeys.list(buildQueryParams({ per_page: 3, featured: true })),
    wrapPaginated(data.news, 3),
  )
  qc.setQueryData(
    testimonialKeys.list(buildQueryParams({ per_page: 6, featured: true })),
    wrapPaginated(data.testimonials, 6),
  )
  qc.setQueryData(
    schoolValueKeys.list(buildQueryParams({ per_page: 12 })),
    wrapPaginated(data.school_values ?? [], 12),
  )
  qc.setQueryData(
    schoolStatKeys.list(buildQueryParams({ per_page: 12 })),
    wrapPaginated(data.school_stats ?? [], 12),
  )
}

const MIN_SPLASH_MS = 1000

export function useLandingPrefetch() {
  const queryClient = useQueryClient()
  const hasCachedData = !!queryClient.getQueryData(LANDING_KEY)
  const [minTimeElapsed, setMinTimeElapsed] = useState(hasCachedData)

  useEffect(() => {
    if (hasCachedData) return
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS)
    return () => clearTimeout(timer)
  }, [hasCachedData])

  const { data } = useQuery({
    queryKey: LANDING_KEY,
    queryFn: async () => {
      const { data } = await api.get<{ data: LandingData }>('/v1/landing')
      const landing = data.data
      seedSectionCaches(queryClient, landing)
      return landing
    },
    ...queryConfig,
  })

  return { isLoading: !data || !minTimeElapsed }
}
