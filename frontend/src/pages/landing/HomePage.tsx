import { useEffect, useMemo, useState } from 'react'
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
import { LandingSplashScreen } from '@/components/landing/LandingSplashScreen'
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
import { useSchool } from '@/hooks/useSchool'
import { useSplashScreen } from '@/hooks/useSettings'
import { resolveSplashDisplay } from '@/schemas/splashScreen'

export function HomePage() {
  const { isLoading: landingLoading } = useLandingPrefetch()
  const { splash, isLoading: splashSettingsLoading } = useSplashScreen()
  const { data: school } = useSchool()

  const splashDisplay = useMemo(
    () => resolveSplashDisplay(splash, school),
    [splash, school],
  )

  const [showSplash, setShowSplash] = useState(true)
  const [closing, setClosing] = useState(false)
  const [minDurationElapsed, setMinDurationElapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinDurationElapsed(true), splashDisplay.durationMs)
    return () => clearTimeout(timer)
  }, [splashDisplay.durationMs])

  useEffect(() => {
    if (!showSplash || closing) return
    if (!landingLoading && !splashSettingsLoading && minDurationElapsed) {
      setClosing(true)
      const timer = setTimeout(() => setShowSplash(false), 700)
      return () => clearTimeout(timer)
    }
  }, [landingLoading, splashSettingsLoading, minDurationElapsed, showSplash, closing])

  useEffect(() => {
    if (!showSplash) return
    const safety = setTimeout(() => {
      setClosing(true)
      setTimeout(() => setShowSplash(false), 700)
    }, splashDisplay.durationMs + 1500)
    return () => clearTimeout(safety)
  }, [showSplash, splashDisplay.durationMs])

  return (
    <>
      {showSplash ? (
        <LandingSplashScreen
          closing={closing}
          image={splashDisplay.image}
          title={splashDisplay.title}
          subtitle={splashDisplay.subtitle}
        />
      ) : null}

      {!showSplash && (
        <div className="flex min-h-svh flex-col">
          <Header />
          <main id="main-content" className="flex-1 pb-16 lg:pb-0">
            <HeroSection />
            <SectionDivider />
            <AboutSection />
            <SectionDivider />
            <FeaturedProgramsSection />
            <SectionDivider />
            <AchievementsSection />
            <SectionDivider />
            <ActivitiesSection />
            <SectionDivider />
            <GallerySection />
            <SectionDivider />
            <FacilitiesSection />
            <SectionDivider />
            <AgendaSection />
            <SectionDivider />
            <NewsSection />
            <SectionDivider />
            <DocumentsSection />
            <SectionDivider />
            <PrincipalSection />
            <TeachersSection />
            <StaffSection />
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
