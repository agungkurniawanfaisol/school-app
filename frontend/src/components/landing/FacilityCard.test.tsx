import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { FacilityCard } from '@/components/landing/FacilityCard'
import type { Facility } from '@/types'

const base: Facility = {
  id: 1,
  uuid: 'f-1',
  school_id: 1,
  name: 'Lab Komputer',
  slug: 'lab-komputer',
  description: null,
  thumbnail: null,
  category: 'akademik',
  order: 1,
  is_active: true,
  is_featured: false,
  created_at: null,
  photos: [],
}

describe('FacilityCard', () => {
  it('resolves photo url for display', () => {
    const { container } = render(
      <MemoryRouter>
        <FacilityCard
          facility={{
            ...base,
            photos: [
              {
                id: 1,
                facility_id: 1,
                path: 'facilities/lab.jpg',
                url: '/storage/facilities/lab.jpg',
                caption: null,
                order: 0,
                is_active: true,
              },
            ],
          }}
        />
      </MemoryRouter>,
    )

    expect(container.querySelector('img')).toHaveAttribute('src', '/storage/facilities/lab.jpg')
  })

  it('prefixes storage path when only relative path is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <FacilityCard
          facility={{
            ...base,
            photos: [
              {
                id: 1,
                facility_id: 1,
                path: 'facilities/lab.jpg',
                caption: null,
                order: 0,
                is_active: true,
              },
            ],
          }}
        />
      </MemoryRouter>,
    )

    expect(container.querySelector('img')).toHaveAttribute('src', '/storage/facilities/lab.jpg')
  })
})
