import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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

vi.mock('@/components/landing/CurriculumSection', () => ({
  CurriculumSection: () => <section data-testid="curriculum">Curriculum</section>,
}))

vi.mock('@/components/landing/TeachersSection', () => ({
  TeachersSection: () => <section data-testid="teachers">Teachers</section>,
}))

vi.mock('@/components/landing/ActivitiesSection', () => ({
  ActivitiesSection: () => <section data-testid="activities">Activities</section>,
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

vi.mock('@/components/landing/CoursesPreviewSection', () => ({
  CoursesPreviewSection: () => <section data-testid="courses">Courses</section>,
}))

vi.mock('@/components/landing/PmbCtaSection', () => ({
  PmbCtaSection: () => <section data-testid="pmb-cta">PMB CTA</section>,
}))

vi.mock('@/components/landing/ContactSection', () => ({
  ContactSection: () => <section data-testid="contact">Contact</section>,
}))

vi.mock('@/components/landing/SectionDivider', () => ({
  SectionDivider: () => <hr data-testid="divider" />,
}))

describe('HomePage', () => {
  it('renders main landing sections', () => {
    renderWithProviders(<HomePage />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('about')).toBeInTheDocument()
    expect(screen.getByTestId('curriculum')).toBeInTheDocument()
    expect(screen.getByTestId('teachers')).toBeInTheDocument()
    expect(screen.getByTestId('activities')).toBeInTheDocument()
    expect(screen.getByTestId('facilities')).toBeInTheDocument()
    expect(screen.getByTestId('news')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials')).toBeInTheDocument()
    expect(screen.getByTestId('courses')).toBeInTheDocument()
    expect(screen.getByTestId('pmb-cta')).toBeInTheDocument()
    expect(screen.getByTestId('contact')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
