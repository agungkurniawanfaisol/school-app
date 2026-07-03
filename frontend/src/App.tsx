import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AnimatedOutlet } from '@/components/motion'
import { AdminPreviewGate } from '@/components/admin/AdminPreviewGate'
import { FloatingActions } from '@/components/layout/FloatingActions'
import { OfflineIndicator } from '@/components/layout/OfflineIndicator'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { HomePage } from '@/pages/landing/HomePage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { OAuthCallbackPage } from '@/pages/admin/OAuthCallbackPage'
import { NewsCatalogPage } from '@/pages/news/NewsCatalogPage'
import { NewsDetailPage } from '@/pages/news/NewsDetailPage'
import { ActivitiesCatalogPage } from '@/pages/activities/ActivitiesCatalogPage'
import { ActivityDetailPage } from '@/pages/activities/ActivityDetailPage'
import { TeachersCatalogPage } from '@/pages/teachers/TeachersCatalogPage'
import { TeacherPublicDetailPage } from '@/pages/teachers/TeacherPublicDetailPage'
import { FacilityPublicDetailPage } from '@/pages/facilities/FacilityPublicDetailPage'
import { FacilitiesCatalogPage } from '@/pages/facilities/FacilitiesCatalogPage'
import { CurriculumPublicDetailPage } from '@/pages/curriculums/CurriculumPublicDetailPage'
import { FeaturedProgramsCatalogPage } from '@/pages/curriculums/FeaturedProgramsCatalogPage'
import { PmbInfoPage } from '@/pages/pmb/PmbInfoPage'
import { PmbRegisterPage } from '@/pages/pmb/PmbRegisterPage'
import { PmbStatusPage } from '@/pages/pmb/PmbStatusPage'
import { CourseCatalogPage } from '@/pages/lms/CourseCatalogPage'
import { CourseDetailPage } from '@/pages/lms/CourseDetailPage'

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const AdminNewsListPage = lazy(() => import('@/pages/admin/NewsListPage').then((m) => ({ default: m.AdminNewsListPage })))
const NewsFormPage = lazy(() => import('@/pages/admin/NewsFormPage').then((m) => ({ default: m.NewsFormPage })))
const NewsPreviewPage = lazy(() => import('@/pages/admin/NewsPreviewPage').then((m) => ({ default: m.NewsPreviewPage })))
const AdminTeachersListPage = lazy(() =>
  import('@/pages/admin/TeachersListPage').then((m) => ({ default: m.AdminTeachersListPage })),
)
const AdminTeacherDetailPage = lazy(() =>
  import('@/pages/admin/TeacherDetailPage').then((m) => ({ default: m.AdminTeacherDetailPage })),
)
const TeacherFormPage = lazy(() => import('@/pages/admin/TeacherFormPage').then((m) => ({ default: m.TeacherFormPage })))
const TeacherPreviewPage = lazy(() =>
  import('@/pages/admin/TeacherPreviewPage').then((m) => ({ default: m.TeacherPreviewPage })),
)
const AdminFacilitiesListPage = lazy(() =>
  import('@/pages/admin/FacilitiesListPage').then((m) => ({ default: m.AdminFacilitiesListPage })),
)
const FacilityFormPage = lazy(() => import('@/pages/admin/FacilityFormPage').then((m) => ({ default: m.FacilityFormPage })))
const FacilityPreviewPage = lazy(() =>
  import('@/pages/admin/FacilityPreviewPage').then((m) => ({ default: m.FacilityPreviewPage })),
)
const ActivityFormPage = lazy(() => import('@/pages/admin/ActivityFormPage').then((m) => ({ default: m.ActivityFormPage })))
const ActivityPreviewPage = lazy(() =>
  import('@/pages/admin/ActivityPreviewPage').then((m) => ({ default: m.ActivityPreviewPage })),
)
const StudentActivitiesListPage = lazy(() =>
  import('@/pages/admin/StudentActivitiesListPage').then((m) => ({ default: m.StudentActivitiesListPage })),
)
const FeaturedProgramsListPage = lazy(() =>
  import('@/pages/admin/FeaturedProgramsListPage').then((m) => ({ default: m.FeaturedProgramsListPage })),
)
const FeaturedProgramFormPage = lazy(() =>
  import('@/pages/admin/FeaturedProgramFormPage').then((m) => ({ default: m.FeaturedProgramFormPage })),
)
const HeroSlidersListPage = lazy(() =>
  import('@/pages/admin/HeroSlidersListPage').then((m) => ({ default: m.HeroSlidersListPage })),
)
const HeroSliderFormPage = lazy(() =>
  import('@/pages/admin/HeroSliderFormPage').then((m) => ({ default: m.HeroSliderFormPage })),
)
const TestimonialsListPage = lazy(() =>
  import('@/pages/admin/TestimonialsListPage').then((m) => ({ default: m.TestimonialsListPage })),
)
const TestimonialFormPage = lazy(() =>
  import('@/pages/admin/TestimonialFormPage').then((m) => ({ default: m.TestimonialFormPage })),
)
const CoursesListPage = lazy(() => import('@/pages/admin/CoursesListPage').then((m) => ({ default: m.CoursesListPage })))
const CourseFormPage = lazy(() => import('@/pages/admin/CourseFormPage').then((m) => ({ default: m.CourseFormPage })))
const CourseModulesPage = lazy(() =>
  import('@/pages/admin/CourseModulesPage').then((m) => ({ default: m.CourseModulesPage })),
)
const CourseEnrollmentsListPage = lazy(() =>
  import('@/pages/admin/CourseEnrollmentsListPage').then((m) => ({ default: m.CourseEnrollmentsListPage })),
)
const PmbRegistrationsListPage = lazy(() =>
  import('@/pages/admin/PmbRegistrationsListPage').then((m) => ({ default: m.PmbRegistrationsListPage })),
)
const PmbRegistrationDetailPage = lazy(() =>
  import('@/pages/admin/PmbRegistrationDetailPage').then((m) => ({ default: m.PmbRegistrationDetailPage })),
)
const SchoolsListPage = lazy(() => import('@/pages/admin/SchoolsListPage').then((m) => ({ default: m.SchoolsListPage })))
const SchoolFormPage = lazy(() => import('@/pages/admin/SchoolFormPage').then((m) => ({ default: m.SchoolFormPage })))
const VisionMissionPage = lazy(() =>
  import('@/pages/admin/VisionMissionPage').then((m) => ({ default: m.VisionMissionPage })),
)
const MediaLibraryPage = lazy(() =>
  import('@/pages/admin/MediaLibraryPage').then((m) => ({ default: m.MediaLibraryPage })),
)
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const UsersListPage = lazy(() => import('@/pages/admin/UsersListPage').then((m) => ({ default: m.UsersListPage })))
const UserFormPage = lazy(() => import('@/pages/admin/UserFormPage').then((m) => ({ default: m.UserFormPage })))
const ProfilePage = lazy(() => import('@/pages/admin/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const VirtualTourListPage = lazy(() =>
  import('@/pages/admin/VirtualTourListPage').then((m) => ({ default: m.VirtualTourListPage })),
)
const VirtualTourEditorPage = lazy(() =>
  import('@/pages/admin/VirtualTourEditorPage').then((m) => ({ default: m.VirtualTourEditorPage })),
)
const VirtualTourCatalogPage = lazy(() =>
  import('@/pages/virtual-tour/VirtualTourCatalogPage').then((m) => ({ default: m.VirtualTourCatalogPage })),
)
const VirtualTourViewerPage = lazy(() =>
  import('@/pages/virtual-tour/VirtualTourViewerPage').then((m) => ({ default: m.VirtualTourViewerPage })),
)

function AdminRouteFallback() {
  return (
    <div className="space-y-4 p-2">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

function LazyAdmin({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AdminRouteFallback />}>{children}</Suspense>
}

function CurriculumAdminEditRedirect() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/admin/program-unggulan/${id}/edit`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <OfflineIndicator />
      <FloatingActions />
      <Routes>
        <Route element={<AnimatedOutlet />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/guru" element={<TeachersCatalogPage />} />
          <Route path="/guru/detail/:uuid" element={<TeacherPublicDetailPage />} />
          <Route path="/guru/:slug" element={<TeacherPublicDetailPage />} />
          <Route path="/fasilitas" element={<FacilitiesCatalogPage />} />
          <Route path="/fasilitas/:slug" element={<FacilityPublicDetailPage />} />
          <Route path="/program-unggulan" element={<FeaturedProgramsCatalogPage />} />
          <Route path="/program/:slug" element={<CurriculumPublicDetailPage />} />
          <Route path="/kurikulum/:slug" element={<CurriculumPublicDetailPage />} />
          <Route path="/kursus" element={<CourseCatalogPage />} />
          <Route path="/kursus/:slug" element={<CourseDetailPage />} />
          <Route path="/pmb" element={<PmbInfoPage />} />
          <Route path="/pmb/daftar" element={<PmbRegisterPage />} />
          <Route path="/pmb/status" element={<PmbStatusPage />} />
          <Route path="/pmb/status/:token" element={<PmbStatusPage />} />
          <Route path="/berita" element={<NewsCatalogPage />} />
          <Route path="/berita/detail/:uuid" element={<NewsDetailPage />} />
          <Route path="/kegiatan" element={<ActivitiesCatalogPage />} />
          <Route path="/kegiatan/detail/:uuid" element={<ActivityDetailPage />} />
          <Route path="/tur-virtual" element={<VirtualTourCatalogPage />} />
          <Route path="/tur-virtual/:slug" element={<VirtualTourViewerPage />} />

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/login/oauth" element={<OAuthCallbackPage />} />

          <Route
            path="/admin/teachers/preview"
            element={
              <AdminPreviewGate>
                <LazyAdmin>
                  <TeacherPreviewPage />
                </LazyAdmin>
              </AdminPreviewGate>
            }
          />
          <Route
            path="/admin/teachers/:uuid/preview"
            element={
              <AdminPreviewGate>
                <LazyAdmin>
                  <TeacherPreviewPage />
                </LazyAdmin>
              </AdminPreviewGate>
            }
          />
          <Route
            path="/admin/facilities/:uuid/preview"
            element={
              <AdminPreviewGate>
                <LazyAdmin>
                  <FacilityPreviewPage />
                </LazyAdmin>
              </AdminPreviewGate>
            }
          />
          <Route
            path="/admin/news/:uuid/preview"
            element={
              <AdminPreviewGate>
                <LazyAdmin>
                  <NewsPreviewPage />
                </LazyAdmin>
              </AdminPreviewGate>
            }
          />
          <Route
            path="/admin/student-activities/:uuid/preview"
            element={
              <AdminPreviewGate>
                <LazyAdmin>
                  <ActivityPreviewPage />
                </LazyAdmin>
              </AdminPreviewGate>
            }
          />

          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <LazyAdmin>
                  <DashboardPage />
                </LazyAdmin>
              }
            />
            <Route path="news" element={<LazyAdmin><AdminNewsListPage /></LazyAdmin>} />
            <Route path="news/create" element={<LazyAdmin><NewsFormPage /></LazyAdmin>} />
            <Route path="news/:uuid/edit" element={<LazyAdmin><NewsFormPage /></LazyAdmin>} />
            <Route path="teachers" element={<LazyAdmin><AdminTeachersListPage /></LazyAdmin>} />
            <Route path="teachers/create" element={<LazyAdmin><TeacherFormPage /></LazyAdmin>} />
            <Route path="teachers/:uuid/edit" element={<LazyAdmin><TeacherFormPage /></LazyAdmin>} />
            <Route path="teachers/:uuid" element={<LazyAdmin><AdminTeacherDetailPage /></LazyAdmin>} />
            <Route path="program-unggulan" element={<LazyAdmin><FeaturedProgramsListPage /></LazyAdmin>} />
            <Route path="program-unggulan/create" element={<LazyAdmin><FeaturedProgramFormPage /></LazyAdmin>} />
            <Route path="program-unggulan/:id/edit" element={<LazyAdmin><FeaturedProgramFormPage /></LazyAdmin>} />
            <Route path="curriculums" element={<Navigate to="/admin/program-unggulan" replace />} />
            <Route path="curriculums/create" element={<Navigate to="/admin/program-unggulan/create" replace />} />
            <Route path="curriculums/:id/edit" element={<CurriculumAdminEditRedirect />} />
            <Route path="hero-sliders" element={<LazyAdmin><HeroSlidersListPage /></LazyAdmin>} />
            <Route path="hero-sliders/create" element={<LazyAdmin><HeroSliderFormPage /></LazyAdmin>} />
            <Route path="hero-sliders/:id/edit" element={<LazyAdmin><HeroSliderFormPage /></LazyAdmin>} />
            <Route path="virtual-tours" element={<LazyAdmin><VirtualTourListPage /></LazyAdmin>} />
            <Route path="virtual-tours/create" element={<LazyAdmin><VirtualTourEditorPage /></LazyAdmin>} />
            <Route path="virtual-tours/:uuid/edit" element={<LazyAdmin><VirtualTourEditorPage /></LazyAdmin>} />
            <Route path="student-activities" element={<LazyAdmin><StudentActivitiesListPage /></LazyAdmin>} />
            <Route path="student-activities/create" element={<LazyAdmin><ActivityFormPage /></LazyAdmin>} />
            <Route path="student-activities/:uuid/edit" element={<LazyAdmin><ActivityFormPage /></LazyAdmin>} />
            <Route path="testimonials" element={<LazyAdmin><TestimonialsListPage /></LazyAdmin>} />
            <Route path="testimonials/create" element={<LazyAdmin><TestimonialFormPage /></LazyAdmin>} />
            <Route path="testimonials/:id/edit" element={<LazyAdmin><TestimonialFormPage /></LazyAdmin>} />
            <Route path="facilities" element={<LazyAdmin><AdminFacilitiesListPage /></LazyAdmin>} />
            <Route path="facilities/create" element={<LazyAdmin><FacilityFormPage /></LazyAdmin>} />
            <Route path="facilities/:uuid/edit" element={<LazyAdmin><FacilityFormPage /></LazyAdmin>} />
            <Route path="courses" element={<LazyAdmin><CoursesListPage /></LazyAdmin>} />
            <Route path="courses/create" element={<LazyAdmin><CourseFormPage /></LazyAdmin>} />
            <Route path="courses/:id/edit" element={<LazyAdmin><CourseFormPage /></LazyAdmin>} />
            <Route path="courses/:id/modules" element={<LazyAdmin><CourseModulesPage /></LazyAdmin>} />
            <Route path="course-modules" element={<Navigate to="/admin/courses" replace />} />
            <Route path="course-enrollments" element={<LazyAdmin><CourseEnrollmentsListPage /></LazyAdmin>} />
            <Route path="pmb-registrations" element={<LazyAdmin><PmbRegistrationsListPage /></LazyAdmin>} />
            <Route path="pmb-registrations/:id" element={<LazyAdmin><PmbRegistrationDetailPage /></LazyAdmin>} />
            <Route path="schools" element={<LazyAdmin><SchoolsListPage /></LazyAdmin>} />
            <Route path="schools/create" element={<LazyAdmin><SchoolFormPage /></LazyAdmin>} />
            <Route path="schools/:id/edit" element={<LazyAdmin><SchoolFormPage /></LazyAdmin>} />
            <Route path="vision-mission" element={<LazyAdmin><VisionMissionPage /></LazyAdmin>} />
            <Route path="media" element={<LazyAdmin><MediaLibraryPage /></LazyAdmin>} />
            <Route path="settings" element={<LazyAdmin><SettingsPage /></LazyAdmin>} />
            <Route path="users" element={<LazyAdmin><UsersListPage /></LazyAdmin>} />
            <Route path="users/create" element={<LazyAdmin><UserFormPage /></LazyAdmin>} />
            <Route path="users/:id/edit" element={<LazyAdmin><UserFormPage /></LazyAdmin>} />
            <Route path="profile" element={<LazyAdmin><ProfilePage /></LazyAdmin>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
