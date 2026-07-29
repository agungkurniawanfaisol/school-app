import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({ data: { id: 1, name: 'Nurul Hikmah', slug: 'nurul-hikmah' } }),
}))

vi.mock('@/hooks/useTeachers', () => ({
  useAdminTeacherDetail: () => ({ data: undefined, isLoading: false }),
  useCreateTeacher: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateTeacher: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useMediaUpload', () => ({
  useMediaUpload: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/useUnsavedChanges', () => ({
  useUnsavedChanges: () => undefined,
}))

vi.mock('@/components/editor/RichPageEditor', () => ({
  RichPageEditor: () => <div data-testid="rich-editor" />,
}))

describe('TeacherFormPage create', () => {
  it('renders create form without crashing', async () => {
    const { TeacherFormPage } = await import('@/pages/admin/TeacherFormPage')

    renderWithProviders(<TeacherFormPage />, {
      route: '/admin/teachers/create',
      path: '/admin/teachers/create',
    })

    expect(await screen.findByRole('heading', { name: 'Tambah Guru' })).toBeInTheDocument()
  })
})
