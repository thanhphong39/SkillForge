import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore.js'
import { AppShell } from './components/layout/AppShell.jsx'
import LoginPage from './pages/Login/index.jsx'
import DashboardPage from './pages/Dashboard/index.jsx'
import StrategyMapPage from './pages/StrategyMap/index.jsx'
import KPISetupPage from './pages/KPISetup/index.jsx'
import KPIEntryPage from './pages/KPIEntry/index.jsx'
import ReportsPage from './pages/Reports/index.jsx'
import AssessmentPage from './pages/Assessment/index.jsx'
import SwotPage from './pages/StrategyBuild/SwotPage.jsx'
import FormulationPage from './pages/StrategyBuild/FormulationPage.jsx'
import SelectionPage from './pages/StrategyResults/SelectionPage.jsx'
import OutcomesPage from './pages/StrategyResults/OutcomesPage.jsx'
import PerspectivesPage from './pages/StrategyMap/PerspectivesPage.jsx'
import FishbonePage from './pages/Fishbone/index.jsx'
import WeightAllocationPage from './pages/WeightAllocation/index.jsx'
import ActionPlanPage from './pages/ActionPlan/index.jsx'

function RequireAuth() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard',                   element: <DashboardPage /> },

          // BSC 8 Steps
          { path: 'assessment',                  element: <AssessmentPage /> },
          { path: 'strategy-build',              element: <Navigate to="/strategy-build/swot" replace /> },
          { path: 'strategy-build/swot',         element: <SwotPage /> },
          { path: 'strategy-build/formulate',    element: <FormulationPage /> },
          { path: 'strategy-results',            element: <Navigate to="/strategy-results/selection" replace /> },
          { path: 'strategy-results/selection',  element: <SelectionPage /> },
          { path: 'strategy-results/outcomes',   element: <OutcomesPage /> },
          { path: 'strategy-map',                element: <Navigate to="/strategy-map/perspectives" replace /> },
          { path: 'strategy-map/perspectives',   element: <PerspectivesPage /> },
          { path: 'strategy-map/company',        element: <StrategyMapPage /> },
          { path: 'fishbone',                    element: <FishbonePage /> },
          { path: 'kpi-setup',                   element: <KPISetupPage /> },
          { path: 'weight-allocation',           element: <WeightAllocationPage /> },
          { path: 'action-plan',                 element: <ActionPlanPage /> },

          // Tools
          { path: 'kpi-entry',                   element: <KPIEntryPage /> },
          { path: 'reports',                     element: <ReportsPage /> },
        ],
      },
    ],
  },
])
