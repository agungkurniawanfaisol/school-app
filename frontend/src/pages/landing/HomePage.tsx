import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { AboutSection } from '@/components/landing/AboutSection'
import { ActivitiesSection } from '@/components/landing/ActivitiesSection'
import { ContactSection } from '@/components/landing/ContactSection'
// import { CoursesPreviewSection } from '@/components/landing/CoursesPreviewSection'
import { FeaturedProgramsSection } from '@/components/landing/FeaturedProgramsSection'
import { PrincipalSection } from '@/components/landing/PrincipalSection'
import { StaffSection } from '@/components/landing/StaffSection'
import { FacilitiesSection } from '@/components/landing/FacilitiesSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { NewsSection } from '@/components/landing/NewsSection'
import { PmbCtaSection } from '@/components/landing/PmbCtaSection'
import { SectionDivider } from '@/components/landing/SectionDivider'
import { TeachersSection } from '@/components/landing/TeachersSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'

export function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <PrincipalSection />
        <SectionDivider />
        <FeaturedProgramsSection />
        <SectionDivider />
        <TeachersSection />
        <StaffSection />
        <SectionDivider />
        <ActivitiesSection />
        <SectionDivider />
        <FacilitiesSection />
        <SectionDivider />
        <NewsSection />
        <SectionDivider />
        <TestimonialsSection />
        <SectionDivider />
        {/* <CoursesPreviewSection /> — diaktifkan nanti saat kursus sudah tersedia */}
        <PmbCtaSection />
        <ContactSection />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
