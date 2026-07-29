import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { Badge } from '@/components/ui/badge'
import type { PmbRegistration } from '@/types'

describe('Admin PMB list unread badge', () => {
  it('shows Baru badge and row highlight for unread rows', () => {
    const rows: PmbRegistration[] = [
      {
        id: 1,
        uuid: 'u1',
        registration_number: 'PMB-1',
        student_name: 'Samuel',
        birth_place: null,
        birth_date: null,
        gender: null,
        parent_name: 'A',
        parent_phone: '1',
        parent_email: null,
        address: null,
        previous_school: null,
        grade_applied: 'VII',
        status: 'awaiting_verification',
        has_admin_unread: true,
        created_at: null,
        updated_at: null,
      },
    ]

    render(
      <MemoryRouter>
        <AdminDataTable
          columns={[
            {
              key: 'name',
              header: 'Nama',
              cell: (item) => (
                <span>
                  {item.student_name}
                  {item.has_admin_unread ? <Badge variant="destructive">Baru</Badge> : null}
                </span>
              ),
            },
          ]}
          data={rows}
          meta={{
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 1,
            from: 1,
            to: 1,
          }}
          isLoading={false}
          isFetching={false}
          page={1}
          onPageChange={() => undefined}
          search=""
          onSearchChange={() => undefined}
          getRowClassName={(item) => (item.has_admin_unread ? 'bg-primary/5' : undefined)}
        />
      </MemoryRouter>,
    )

    expect(screen.getAllByText('Baru').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Samuel').length).toBeGreaterThan(0)
  })
})
