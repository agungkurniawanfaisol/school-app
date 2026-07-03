import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { AboutSection } from '@/components/landing/AboutSection'
import { ActivitiesSection } from '@/components/landing/ActivitiesSection'
import { ContactSection } from '@/components/landing/ContactSection'
import { CoursesPreviewSection } from '@/components/landing/CoursesPreviewSection'
import { CurriculumSection } from '@/components/landing/CurriculumSection'
import { FacilitiesSection } from '@/components/landing/FacilitiesSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { NewsSection } from '@/components/landing/NewsSection'
import { PmbCtaSection } from '@/components/landing/PmbCtaSection'
import { TeachersSection } from '@/components/landing/TeachersSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'

export function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <CurriculumSection />
        <TeachersSection />
        <ActivitiesSection />
        <FacilitiesSection />
        <NewsSection />
        <TestimonialsSection />
        <CoursesPreviewSection />
        <PmbCtaSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
