import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAdminAuthStore } from './store/adminAuthStore.js'
import { AdminShell } from './components/layout/AdminShell.jsx'
import AdminLoginPage from './pages/Login/index.jsx'
import OverviewPage from './pages/Overview/index.jsx'
import CompanySetupPage from './pages/CompanySetup/index.jsx'
import DepartmentSetupPage from './pages/DepartmentSetup/index.jsx'
import UserManagementPage from './pages/UserManagement/index.jsx'
import PeriodManagementPage from './pages/PeriodManagement/index.jsx'
import SystemConfigPage from './pages/SystemConfig/index.jsx'

function RequireAdminAuth() {
  const { admin } = useAdminAuthStore()
  if (!admin) return <Navigate to="/login" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  { path: '/login', element: <AdminLoginPage /> },
  {
    path: '/',
    element: <RequireAdminAuth />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { index: true,          element: <Navigate to="/overview" replace /> },
          { path: 'overview',     element: <OverviewPage /> },
          { path: 'company-setup',element: <CompanySetupPage /> },
          { path: 'departments',  element: <DepartmentSetupPage /> },
          { path: 'users',        element: <UserManagementPage /> },
          { path: 'periods',      element: <PeriodManagementPage /> },
          { path: 'system-config',element: <SystemConfigPage /> },
        ],
      },
    ],
  },
])
