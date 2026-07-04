import { useEffect } from 'react'
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

// #region agent log
const __dbgHome = (msg: string, data?: Record<string, unknown>) => { fetch('http://127.0.0.1:7357/ingest/9d8959b5-b5eb-49d7-b822-17cfa3051c69',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'30f7f9'},body:JSON.stringify({sessionId:'30f7f9',location:'HomePage.tsx',message:msg,data:data??{},timestamp:Date.now(),hypothesisId:'C,D,E'})}).catch(()=>{}); };
__dbgHome('HomePage.tsx module evaluated', { timeSinceOrigin: performance.now() });
// #endregion

export function HomePage() {
  useLandingPrefetch()

  // #region agent log
  useEffect(() => { __dbgHome('HomePage mounted', { timeSinceOrigin: performance.now() }); }, []);
  // #endregion

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
  )
}
