import { useEffect, useState } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { AboutSection } from '@/components/landing/AboutSection'
import { AchievementsSection } from '@/components/landing/AchievementsSection'
import { ActivitiesSection } from '@/components/landing/ActivitiesSection'
import { AgendaSection } from '@/components/landing/AgendaSection'
import { ContactSection } from '@/components/landing/ContactSection'
import { DocumentsSection } from '@/components/landing/DocumentsSection'
import { FeaturedProgramsSection } from '@/components/landing/FeaturedProgramsSection'
import { GallerySection } from '@/components/landing/GallerySection'
import { PrincipalSection } from '@/components/landing/PrincipalSection'
import { StaffSection } from '@/components/landing/StaffSection'
import { FacilitiesSection } from '@/components/landing/FacilitiesSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { NewsSection } from '@/components/landing/NewsSection'
import { PmbCtaSection } from '@/components/landing/PmbCtaSection'
import { SectionDivider } from '@/components/landing/SectionDivider'
import { SuggestionBoxSection } from '@/components/landing/SuggestionBoxSection'
import { TeachersSection } from '@/components/landing/TeachersSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { useLandingPrefetch } from '@/hooks/useLandingPrefetch'

function SplashScreen({ closing }: { closing: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex min-h-svh flex-col items-center justify-center gap-5 bg-background will-change-[opacity] ${closing ? 'animate-splash-out' : ''}`}
    >
      <img
        src="/logo.png"
        alt="Logo Sekolah Islam Nurul Hikmah"
        className={`h-28 w-28 object-contain will-change-transform sm:h-36 sm:w-36 lg:h-44 lg:w-44 ${closing ? 'animate-splash-zoom' : 'animate-splash-in'}`}
      />
      <p
        className={`text-center text-xl font-bold text-primary will-change-transform sm:text-2xl lg:text-3xl ${closing ? 'animate-splash-zoom' : 'animate-splash-text-in'}`}
      >
        Sekolah Islam Nurul Hikmah
      </p>
    </div>
  )
}

const MAX_SPLASH_MS = 2500

export function HomePage() {
  const { isLoading } = useLandingPrefetch()
  const [showSplash, setShowSplash] = useState(isLoading)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!isLoading && showSplash && !closing) {
      setClosing(true)
      const timer = setTimeout(() => setShowSplash(false), 700)
      return () => clearTimeout(timer)
    }
  }, [isLoading, showSplash, closing])

  useEffect(() => {
    if (!showSplash) return
    const safety = setTimeout(() => {
      setClosing(true)
      setTimeout(() => setShowSplash(false), 700)
    }, MAX_SPLASH_MS)
    return () => clearTimeout(safety)
  }, [showSplash])

  return (
    <>
      {showSplash && <SplashScreen closing={closing} />}

      {!showSplash && (
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
            <AchievementsSection />
            <SectionDivider />
            <FacilitiesSection />
            <SectionDivider />
            <GallerySection />
            <SectionDivider />
            <AgendaSection />
            <SectionDivider />
            <NewsSection />
            <SectionDivider />
            <DocumentsSection />
            <SectionDivider />
            <TestimonialsSection />
            <SectionDivider />
            <SuggestionBoxSection />
            <SectionDivider />
            <PmbCtaSection />
            <ContactSection />
          </main>
          <Footer />
          <BottomNav />
        </div>
      )}
    </>
  )
}
