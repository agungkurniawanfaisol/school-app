import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { OfflineIndicator } from '@/components/layout/OfflineIndicator'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminCurriculumsListPage } from '@/pages/admin/CurriculumsListPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { AdminNewsListPage } from '@/pages/admin/NewsListPage'
import { AdminTeachersListPage } from '@/pages/admin/TeachersListPage'
import { HomePage } from '@/pages/landing/HomePage'
import { CourseCatalogPage } from '@/pages/lms/CourseCatalogPage'
import { CourseDetailPage } from '@/pages/lms/CourseDetailPage'
import { PmbInfoPage } from '@/pages/pmb/PmbInfoPage'
import { PmbRegisterPage } from '@/pages/pmb/PmbRegisterPage'
import { PmbStatusPage } from '@/pages/pmb/PmbStatusPage'

export default function App() {
  return (
    <BrowserRouter>
      <OfflineIndicator />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kursus" element={<CourseCatalogPage />} />
        <Route path="/kursus/:slug" element={<CourseDetailPage />} />
        <Route path="/pmb" element={<PmbInfoPage />} />
        <Route path="/pmb/daftar" element={<PmbRegisterPage />} />
        <Route path="/pmb/status" element={<PmbStatusPage />} />
        <Route path="/pmb/status/:token" element={<PmbStatusPage />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="news" element={<AdminNewsListPage />} />
          <Route path="teachers" element={<AdminTeachersListPage />} />
          <Route path="curriculums" element={<AdminCurriculumsListPage />} />
          <Route path="pmb" element={<Navigate to="/pmb" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
