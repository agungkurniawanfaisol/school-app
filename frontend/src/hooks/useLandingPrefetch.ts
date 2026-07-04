import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api, SCHOOL_SLUG } from '@/lib/api'
import { queryConfig, buildQueryParams } from '@/hooks/queryConfig'
import { schoolKeys } from '@/hooks/useSchool'
import { teacherKeys } from '@/hooks/useTeachers'
import { curriculumKeys } from '@/hooks/useCurriculums'
import { activityKeys } from '@/hooks/useActivities'
import { facilityKeys } from '@/hooks/useFacilities'
import { newsKeys } from '@/hooks/useNews'
import { testimonialKeys } from '@/hooks/useTestimonials'
import type {
  Curriculum,
  Facility,
  HeroSlider,
  News,
  PaginatedResponse,
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

export function useLandingPrefetch() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: LANDING_KEY,
    queryFn: async () => {
      const { data } = await api.get<{ data: LandingData }>('/v1/landing')
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
      facilityKeys.list(buildQueryParams({ per_page: 6, featured: true })),
      wrapPaginated(data.facilities, 6),
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
