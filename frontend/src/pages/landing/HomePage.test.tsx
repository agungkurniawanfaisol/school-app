import { act, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from '@/pages/landing/HomePage'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}))

vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

vi.mock('@/components/landing/HeroSection', () => ({
  HeroSection: () => <section data-testid="hero">Hero</section>,
}))

vi.mock('@/components/landing/AboutSection', () => ({
  AboutSection: () => <section data-testid="about">About</section>,
}))

vi.mock('@/components/landing/FeaturedProgramsSection', () => ({
  FeaturedProgramsSection: () => <section data-testid="featured-programs">Featured Programs</section>,
}))

vi.mock('@/components/landing/TeachersSection', () => ({
  TeachersSection: () => <section data-testid="teachers">Teachers</section>,
}))

vi.mock('@/components/landing/ActivitiesSection', () => ({
  ActivitiesSection: () => <section data-testid="activities">Activities</section>,
}))

vi.mock('@/components/landing/AchievementsSection', () => ({
  AchievementsSection: () => <section data-testid="achievements">Achievements</section>,
}))

vi.mock('@/components/landing/GallerySection', () => ({
  GallerySection: () => <section data-testid="gallery">Gallery</section>,
}))

vi.mock('@/components/landing/AgendaSection', () => ({
  AgendaSection: () => <section data-testid="agenda">Agenda</section>,
}))

vi.mock('@/components/landing/DocumentsSection', () => ({
  DocumentsSection: () => <section data-testid="documents">Documents</section>,
}))

vi.mock('@/components/landing/FacilitiesSection', () => ({
  FacilitiesSection: () => <section data-testid="facilities">Facilities</section>,
}))

vi.mock('@/components/landing/NewsSection', () => ({
  NewsSection: () => <section data-testid="news">News</section>,
}))

vi.mock('@/components/landing/TestimonialsSection', () => ({
  TestimonialsSection: () => <section data-testid="testimonials">Testimonials</section>,
}))

vi.mock('@/components/landing/PmbCtaSection', () => ({
  PmbCtaSection: () => <section data-testid="pmb-cta">PMB CTA</section>,
}))

vi.mock('@/components/landing/ContactSection', () => ({
  ContactSection: () => <section data-testid="contact">Contact</section>,
}))

vi.mock('@/components/landing/PrincipalSection', () => ({
  PrincipalSection: () => <section data-testid="principal">Principal</section>,
}))

vi.mock('@/components/landing/FoundationBoardSection', () => ({
  FoundationBoardSection: () => <section data-testid="foundation-board">Foundation Board</section>,
}))

vi.mock('@/components/landing/StaffSection', () => ({
  StaffSection: () => <section data-testid="staff">Staff</section>,
}))

vi.mock('@/components/landing/SectionDivider', () => ({
  SectionDivider: () => <hr data-testid="divider" />,
}))

vi.mock('@/components/layout/BottomNav', () => ({
  BottomNav: () => <nav data-testid="bottom-nav">BottomNav</nav>,
}))

vi.mock('@/hooks/useLandingPrefetch', () => ({
  useLandingPrefetch: () => ({ isLoading: false }),
}))

vi.mock('@/hooks/useSettings', () => ({
  useSplashScreen: () => ({ splash: null, isLoading: false }),
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({ data: { name: 'Nurul Hikmah School' }, isLoading: false }),
}))

async function renderHomeAfterSplash() {
  renderWithProviders(<HomePage />)
  await act(async () => {
    await vi.runAllTimersAsync()
  })
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders main landing sections', async () => {
    await renderHomeAfterSplash()

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('about')).toBeInTheDocument()
    expect(screen.getByTestId('featured-programs')).toBeInTheDocument()
    expect(screen.getByTestId('achievements')).toBeInTheDocument()
    expect(screen.getByTestId('activities')).toBeInTheDocument()
    expect(screen.getByTestId('gallery')).toBeInTheDocument()
    expect(screen.getByTestId('facilities')).toBeInTheDocument()
    expect(screen.getByTestId('agenda')).toBeInTheDocument()
    expect(screen.getByTestId('news')).toBeInTheDocument()
    expect(screen.getByTestId('documents')).toBeInTheDocument()
    expect(screen.getByTestId('foundation-board')).toBeInTheDocument()
    expect(screen.getByTestId('teachers')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials')).toBeInTheDocument()
    expect(screen.getByTestId('pmb-cta')).toBeInTheDocument()
    expect(screen.getByTestId('principal')).toBeInTheDocument()
    expect(screen.getByTestId('staff')).toBeInTheDocument()
    expect(screen.getByTestId('contact')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders sections in the requested landing order', async () => {
    await renderHomeAfterSplash()

    const order = [
      'hero',
      'about',
      'featured-programs',
      'achievements',
      'activities',
      'gallery',
      'facilities',
      'agenda',
      'news',
      'documents',
      'foundation-board',
      'principal',
      'teachers',
      'staff',
      'testimonials',
      'pmb-cta',
      'contact',
    ]

    const nodes = order.map((id) => screen.getByTestId(id))

    for (let i = 0; i < nodes.length - 1; i++) {
      expect(nodes[i].compareDocumentPosition(nodes[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  })
})
