import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
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
  staff: Teacher[]
  activities: StudentActivity[]
  achievements: Achievement[]
  events: Event[]
  documents: Document[]
  photo_albums: PhotoAlbum[]
  facilities: Facility[]
  news: News[]
  testimonials: Testimonial[]
}

const LANDING_KEY = ['landing'] as const

function wrapPaginated<T>(items: T[], perPage: number): PaginatedResponse<T> {
  return {
    data: items,
    meta: {
      current_page: 1,
      from: items.length > 0 ? 1 : null,
      last_page: 1,
      path: '',
      per_page: perPage,
      to: items.length > 0 ? items.length : null,
      total: items.length,
    },
    links: { first: null, last: null, prev: null, next: null },
  }
}

// #region agent log
const __dbgLanding = (msg: string, data?: Record<string, unknown>) => { fetch('http://127.0.0.1:7357/ingest/9d8959b5-b5eb-49d7-b822-17cfa3051c69',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'30f7f9'},body:JSON.stringify({sessionId:'30f7f9',location:'useLandingPrefetch.ts',message:msg,data:data??{},timestamp:Date.now(),hypothesisId:'A,E'})}).catch(()=>{}); };
// #endregion

export function useLandingPrefetch() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: LANDING_KEY,
    queryFn: async () => {
      // #region agent log
      const __t0 = performance.now();
      __dbgLanding('API /v1/landing request START', { timeSinceOrigin: __t0 });
      // #endregion
      const { data } = await api.get<{ data: LandingData }>('/v1/landing')
      // #region agent log
      __dbgLanding('API /v1/landing request END', { timeSinceOrigin: performance.now(), durationMs: performance.now() - __t0 });
      // #endregion
      return data.data
    },
    ...queryConfig,
  })

  useEffect(() => {
    if (!data) return

    if (data.school) {
      queryClient.setQueryData(schoolKeys.detail(SCHOOL_SLUG), data.school)
    }

    queryClient.setQueryData(['hero-sliders'], data.hero_sliders)

    queryClient.setQueryData(
      teacherKeys.list(buildQueryParams({ per_page: 7, type: 'guru' })),
      wrapPaginated(data.teachers, 7),
    )
    queryClient.setQueryData(
      teacherKeys.list(buildQueryParams({ type: 'kepala_sekolah', per_page: 1 })),
      wrapPaginated(data.principal, 1),
    )
    queryClient.setQueryData(
      teacherKeys.list(buildQueryParams({ type: 'staff', per_page: 12 })),
      wrapPaginated(data.staff, 12),
    )
    queryClient.setQueryData(
      curriculumKeys.list(buildQueryParams({ per_page: 6, featured: true })),
      wrapPaginated(data.curriculums, 6),
    )
    queryClient.setQueryData(
      activityKeys.list(buildQueryParams({ per_page: 6, featured: true })),
      wrapPaginated(data.activities, 6),
    )
    queryClient.setQueryData(
      achievementKeys.list(buildQueryParams({ per_page: 6 })),
      wrapPaginated(data.achievements, 6),
    )
    queryClient.setQueryData(
      facilityKeys.list(buildQueryParams({ per_page: 6, featured: true })),
      wrapPaginated(data.facilities, 6),
    )
    queryClient.setQueryData(
      eventKeys.list(buildQueryParams({ per_page: 5 })),
      wrapPaginated(data.events, 5),
    )
    queryClient.setQueryData(
      documentKeys.list(buildQueryParams({ per_page: 6 })),
      wrapPaginated(data.documents, 6),
    )
    queryClient.setQueryData(
      photoAlbumKeys.list(buildQueryParams({ per_page: 4 })),
      wrapPaginated(data.photo_albums, 4),
    )
    queryClient.setQueryData(
      newsKeys.list(buildQueryParams({ per_page: 3, featured: true })),
      wrapPaginated(data.news, 3),
    )
    queryClient.setQueryData(
      testimonialKeys.list(buildQueryParams({ per_page: 6, featured: true })),
      wrapPaginated(data.testimonials, 6),
    )
  }, [data, queryClient])

  return { isLoading: !data }
}
