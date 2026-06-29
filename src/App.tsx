import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { SiteOwnershipMetaTags } from '@/components/seo/SiteOwnershipMetaTags'
import { AdminRoute } from '@/components/admin/AdminRoute'
import { AdminShell } from '@/components/admin/AdminShell'
import { CityGuidesPage } from '@/pages/CityGuidesPage'
import { BookConsultationPage } from '@/pages/BookConsultationPage'
import { CareerGuidesPage } from '@/pages/CareerGuidesPage'
import { CareerGuideDetailPage } from '@/pages/CareerGuideDetailPage'
import { ContactPage } from '@/pages/ContactPage'
import { FindCoursePage } from '@/pages/FindCoursePage'
import { FindCourseCategoryPage } from '@/pages/FindCourseCategoryPage'
import { LandingPage } from '@/pages/LandingPage'
import { BlogListingPage } from '@/pages/BlogListingPage'
import { BlogPostDetailPage } from '@/pages/BlogPostDetailPage'
import { StudentResourcesPage } from '@/pages/StudentResourcesPage'
import { StudentResourceTopicPage } from '@/pages/StudentResourceTopicPage'
import { VisaChecklistPage } from '@/pages/VisaChecklistPage'
import { VisaChecklistViewPage } from '@/pages/VisaChecklistViewPage'
import { CostPlannerPage } from '@/pages/CostPlannerPage'
import { CostPlannerViewPage } from '@/pages/CostPlannerViewPage'
import { AccommodationTipsPage } from '@/pages/AccommodationTipsPage'
import { AccommodationTipsViewPage } from '@/pages/AccommodationTipsViewPage'
import { StudyInNewZealandPage } from '@/pages/StudyInNewZealandPage'
import { FounderBioPage } from '@/pages/FounderBioPage'
import { AdminAIProvidersPage } from '@/pages/admin/AdminAIProvidersPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminLeadDetailPage } from '@/pages/admin/AdminLeadDetailPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminPostEditorPage } from '@/pages/admin/AdminPostEditorPage'
import { AdminPostListPage } from '@/pages/admin/AdminPostListPage'
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage'
import { ADMIN_BASE } from '@/lib/admin/constants'

export default function App() {
  return (
    <BrowserRouter>
      <SiteOwnershipMetaTags />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/study-in-new-zealand" element={<StudyInNewZealandPage />} />
          <Route path="/find-a-course" element={<FindCoursePage />} />
          <Route path="/find-a-course/:categorySlug" element={<FindCourseCategoryPage />} />
          <Route path="/career-guides" element={<CareerGuidesPage />} />
          <Route path="/career-guides/:slug" element={<CareerGuideDetailPage />} />
          <Route path="/student-resources" element={<StudentResourcesPage />} />
          <Route path="/student-resources/visas/checklist/view" element={<VisaChecklistViewPage />} />
          <Route path="/student-resources/visas/checklist" element={<VisaChecklistPage />} />
          <Route path="/student-resources/costs/planner/view" element={<CostPlannerViewPage />} />
          <Route path="/student-resources/costs/planner" element={<CostPlannerPage />} />
          <Route
            path="/student-resources/accommodation/tips/view"
            element={<AccommodationTipsViewPage />}
          />
          <Route path="/student-resources/accommodation/tips" element={<AccommodationTipsPage />} />
          <Route path="/student-resources/:topic" element={<StudentResourceTopicPage />} />
          <Route path="/city-guides" element={<CityGuidesPage />} />
          <Route path="/book-consultation" element={<BookConsultationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about/paul-benn" element={<FounderBioPage />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
        </Route>

        <Route path={`${ADMIN_BASE}/login`} element={<AdminLoginPage />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminShell />}>
            <Route path={ADMIN_BASE} element={<AdminDashboardPage />} />
            <Route path={`${ADMIN_BASE}/leads/:id`} element={<AdminLeadDetailPage />} />
            <Route path={`${ADMIN_BASE}/posts`} element={<AdminPostListPage />} />
            <Route path={`${ADMIN_BASE}/posts/new`} element={<AdminPostEditorPage />} />
            <Route path={`${ADMIN_BASE}/posts/:id`} element={<AdminPostEditorPage />} />
            <Route
              path={`${ADMIN_BASE}/settings/ai-providers`}
              element={<AdminAIProvidersPage />}
            />
            <Route path={`${ADMIN_BASE}/settings/profile`} element={<AdminProfilePage />} />
          </Route>
        </Route>

        <Route path={`${ADMIN_BASE}/*`} element={<Navigate to={ADMIN_BASE} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
