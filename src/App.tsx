import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { AdminRoute } from '@/components/admin/AdminRoute'
import { AdminShell } from '@/components/admin/AdminShell'
import { ContactPage } from '@/pages/ContactPage'
import { LandingPage } from '@/pages/LandingPage'
import { AdminAIProvidersPage } from '@/pages/admin/AdminAIProvidersPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminLeadDetailPage } from '@/pages/admin/AdminLeadDetailPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage'
import { ADMIN_BASE } from '@/lib/admin/constants'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path={`${ADMIN_BASE}/login`} element={<AdminLoginPage />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminShell />}>
            <Route path={ADMIN_BASE} element={<AdminDashboardPage />} />
            <Route path={`${ADMIN_BASE}/leads/:id`} element={<AdminLeadDetailPage />} />
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
