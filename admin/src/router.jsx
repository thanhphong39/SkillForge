import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminShell } from './components/layout/AdminShell.jsx'
import CompanySetupPage from './pages/CompanySetup/index.jsx'
import DepartmentSetupPage from './pages/DepartmentSetup/index.jsx'
import UserManagementPage from './pages/UserManagement/index.jsx'
import SystemConfigPage from './pages/SystemConfig/index.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminShell />,
    children: [
      { index: true, element: <Navigate to="/company-setup" replace /> },
      { path: 'company-setup', element: <CompanySetupPage /> },
      { path: 'departments',   element: <DepartmentSetupPage /> },
      { path: 'users',         element: <UserManagementPage /> },
      { path: 'system-config', element: <SystemConfigPage /> },
    ],
  },
])
