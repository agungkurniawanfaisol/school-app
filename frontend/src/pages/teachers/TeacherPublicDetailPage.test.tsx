import { screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { TeacherPublicDetailPage } from '@/pages/teachers/TeacherPublicDetailPage'
import { renderWithProviders } from '@/test/renderWithProviders'

const useTeacherDetailMock = vi.fn()
const useTeacherDetailByUuidMock = vi.fn()

vi.mock('@/hooks/useTeachers', () => ({
  useTeacherDetail: (slug: string) => useTeacherDetailMock(slug),
  useTeacherDetailByUuid: (uuid: string) => useTeacherDetailByUuidMock(uuid),
}))

const teacher = {
  id: 1,
  uuid: '00c1d94e-b90f-43a0-9f36-1fe6e59ab72b',
  school_id: 1,
  name: 'Ustadz Ahmad Fauzi',
  slug: 'ustadz-ahmad-fauzi',
  title: 'Koordinator Tahfidz',
  subject: 'Tahfidz',
  bio: 'Pengajar tahfidz berpengalaman.',
  content: '<p>Profil lengkap guru.</p>',
  content_json: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Profil lengkap guru.' }] }] },
  photo: null,
  email: 'ustadz.ahmad.fauzi@nurulhikmah.sch.id',
  social_media: { instagram: '@ustadz-ahmad-fauzi' },
  order: 1,
  is_active: true,
  is_featured: true,
}

describe('TeacherPublicDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useTeacherDetailMock.mockReturnValue({ data: undefined, isLoading: false, isError: false })
    useTeacherDetailByUuidMock.mockReturnValue({ data: undefined, isLoading: false, isError: false })
  })

  it('renders teacher profile by slug', () => {
    useTeacherDetailMock.mockReturnValue({ data: teacher, isLoading: false, isError: false })
    useTeacherDetailByUuidMock.mockReturnValue({ data: undefined, isLoading: false, isError: false })

    renderWithProviders(<TeacherPublicDetailPage />, {
      route: '/guru/ustadz-ahmad-fauzi',
      path: '/guru/:slug',
    })

    expect(screen.getByRole('heading', { name: 'Ustadz Ahmad Fauzi' })).toBeInTheDocument()
    expect(screen.getByText('Profil lengkap guru.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Semua guru/i })).toHaveAttribute('href', '/guru')
    expect(useTeacherDetailMock).toHaveBeenCalledWith('ustadz-ahmad-fauzi')
  })

  it('renders teacher profile by uuid', () => {
    useTeacherDetailMock.mockReturnValue({ data: undefined, isLoading: false, isError: false })
    useTeacherDetailByUuidMock.mockReturnValue({ data: teacher, isLoading: false, isError: false })

    renderWithProviders(<TeacherPublicDetailPage />, {
      route: `/guru/detail/${teacher.uuid}`,
      path: '/guru/detail/:uuid',
    })

    expect(screen.getAllByRole('heading', { name: 'Ustadz Ahmad Fauzi' })[0]).toBeInTheDocument()
    expect(useTeacherDetailByUuidMock).toHaveBeenCalledWith(teacher.uuid)
  })
})
