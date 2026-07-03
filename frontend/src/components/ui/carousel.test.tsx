import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from '@/components/ui/carousel'

const scrollTo = vi.fn()

vi.mock('embla-carousel-react', () => ({
  default: () => {
    const api = {
      canScrollPrev: () => true,
      canScrollNext: () => true,
      selectedScrollSnap: () => 0,
      scrollTo,
      on: vi.fn(),
      off: vi.fn(),
    }

    return [vi.fn(), api]
  },
}))

describe('CarouselDots', () => {
  it('renders dot buttons and scrolls on click', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselDots count={2} />
      </Carousel>,
    )

    expect(screen.getByRole('tablist', { name: 'Indikator slide' })).toBeInTheDocument()
    const secondDot = screen.getByRole('tab', { name: 'Slide 2 dari 2' })
    fireEvent.click(secondDot)
    expect(scrollTo).toHaveBeenCalledWith(1)
  })

  it('renders nothing when count is 1', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselDots count={1} />
      </Carousel>,
    )

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
  })
})
