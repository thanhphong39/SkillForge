import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Lightbulb, Target, Map,
  GitBranch, ListChecks, Scale, Rocket, ChevronLeft, ChevronRight,
  ChevronDown, CheckCircle2, Circle, Loader2, BarChart3, ClipboardEdit,
} from 'lucide-react'
import clsx from 'clsx'
import { useUIStore } from '../../store/uiStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'

const NAV_STEPS = [
  {
    step: 'B1', to: '/assessment', icon: ClipboardList,
    label: 'Đánh giá',
  },
  {
    step: 'B2', to: '/strategy-build', icon: Lightbulb,
    label: 'Xây dựng Chiến lược',
    children: [
      { to: '/strategy-build/swot',      label: 'Phân tích SWOT' },
      { to: '/strategy-build/formulate', label: 'Xây dựng Chiến lược' },
    ],
  },
  {
    step: 'B3', to: '/strategy-results', icon: Target,
    label: 'Kết quả chiến lược',
    children: [
      { to: '/strategy-results/selection', label: 'Lựa chọn chiến lược' },
      { to: '/strategy-results/outcomes',  label: 'Kết quả chiến lược' },
    ],
  },
  {
    step: 'B4', to: '/strategy-map', icon: Map,
    label: 'Bản đồ Chiến lược',
    children: [
      { to: '/strategy-map/perspectives', label: 'Thành phần' },
      { to: '/strategy-map/company',      label: 'Công ty' },
    ],
  },
  {
    step: 'B5', to: '/fishbone', icon: GitBranch,
    label: 'Mô hình Xương cá',
  },
  {
    step: 'B6', to: '/kpi-setup', icon: ListChecks,
    label: 'Đo lường & Chỉ tiêu',
  },
  {
    step: 'B7', to: '/weight-allocation', icon: Scale,
    label: 'Phân bổ Tỉ trọng',
  },
  {
    step: 'B8', to: '/action-plan', icon: Rocket,
    label: 'Action Plan',
  },
]

const EXTRA_NAV = [
  { to: '/kpi-entry', icon: ClipboardEdit, label: 'Nhập liệu KPI' },
  { to: '/reports',   icon: BarChart3,     label: 'Báo cáo' },
]

function StepBadge({ step, status, collapsed }) {
  const base = 'shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors'
  if (status === 'completed') return (
    <span className={clsx(base, 'bg-emerald-500/20 text-emerald-400')}>
      {collapsed ? <CheckCircle2 size={12} /> : step}
    </span>
  )
  if (status === 'active') return (
    <span className={clsx(base, 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50')}>
      {collapsed ? <Loader2 size={11} className="animate-spin" /> : step}
    </span>
  )
  return (
    <span className={clsx(base, 'bg-slate-700 text-slate-400')}>
      {collapsed ? <Circle size={10} /> : step}
    </span>
  )
}

function StatusIcon({ status }) {
  if (status === 'completed') return <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
  if (status === 'active')    return <Loader2 size={12} className="text-blue-400 animate-spin shrink-0" />
  return null
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { steps, getCompletedCount } = useBSCWorkflowStore()
  const location = useLocation()

  // Auto-expand steps that contain the active route
  const getInitialExpanded = () => {
    const set = new Set()
    NAV_STEPS.forEach(({ step, children }) => {
      if (children?.some((c) => location.pathname.startsWith(c.to))) set.add(step)
    })
    return set
  }
  const [expandedSteps, setExpandedSteps] = useState(getInitialExpanded)

  const toggleExpand = (step) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev)
      next.has(step) ? next.delete(step) : next.add(step)
      return next
    })
  }

  const completedCount = getCompletedCount()
  const progressPct = Math.round((completedCount / 8) * 100)

  return (
    <aside className={clsx(
      'flex flex-col bg-slate-900 text-white transition-all duration-300 shrink-0 relative',
      sidebarCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={clsx(
        'flex items-center h-16 px-4 border-b border-slate-700/60 shrink-0',
        sidebarCollapsed ? 'justify-center' : 'gap-1'
      )}>
        <div className="w-16 h-16 flex items-center justify-center shrink-0 -ml-2">
          <img src="/logoSkill.png" alt="SkillForge Logo" className="w-full h-full object-contain scale-125" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div className="font-bold text-sm leading-tight text-white -ml-1">SkillForge</div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-slate-700/60">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Tiến độ triển khai</span>
            <span className="text-[10px] text-blue-400 font-semibold">{completedCount}/8 bước</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Home */}
      <div className="px-2 pt-3 pb-1">
        {!sidebarCollapsed && (
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest px-2 mb-2">Tổng quan</p>
        )}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
            isActive
              ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          )}
          title={sidebarCollapsed ? 'Tổng quan' : undefined}
        >
          <LayoutDashboard size={17} className="shrink-0" />
          {!sidebarCollapsed && <span className="font-medium">Tổng quan</span>}
        </NavLink>
      </div>

      {/* BSC Steps */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 scrollbar-thin">
        {!sidebarCollapsed && (
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest px-2 pt-2 pb-2">
            TRIỂN KHAI BSC
          </p>
        )}

        {NAV_STEPS.map(({ step, to, icon: Icon, label, children }) => {
          const status = steps[step]?.status ?? 'pending'
          const hasChildren = !!children
          const isExpanded = expandedSteps.has(step)
          const isParentActive = hasChildren
            ? children.some((c) => location.pathname.startsWith(c.to))
            : location.pathname === to || location.pathname.startsWith(to + '/')

          if (sidebarCollapsed) {
            return (
              <NavLink
                key={step}
                to={hasChildren ? children[0].to : to}
                title={label}
                className={clsx(
                  'flex items-center justify-center py-2.5 rounded-lg transition-colors',
                  isParentActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <StepBadge step={step} status={status} collapsed />
              </NavLink>
            )
          }

          return (
            <div key={step}>
              {/* Parent row */}
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(step)}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                    isParentActive
                      ? 'bg-blue-600/10 text-blue-300 border-l-2 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <StepBadge step={step} status={status} />
                  <Icon size={15} className="shrink-0 text-slate-400" />
                  <span className="font-medium flex-1 truncate text-[13px]">{label}</span>
                  <StatusIcon status={status} />
                  <ChevronDown
                    size={13}
                    className={clsx(
                      'shrink-0 text-slate-500 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>
              ) : (
                <NavLink
                  to={to}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <StepBadge step={step} status={status} />
                  <Icon size={15} className="shrink-0 text-slate-400" />
                  <span className="font-medium flex-1 truncate text-[13px]">{label}</span>
                  <StatusIcon status={status} />
                </NavLink>
              )}

              {/* Children */}
              {hasChildren && (
                <div className={clsx(
                  'overflow-hidden transition-all duration-200',
                  isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                )}>
                  <div className="ml-5 pl-3 border-l border-slate-700/60 mt-0.5 space-y-0.5 pb-1">
                    {children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) => clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-md text-[12px] transition-colors',
                          isActive
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Extra nav */}
        {!sidebarCollapsed && (
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest px-2 pt-4 pb-2">Công cụ</p>
        )}
        {EXTRA_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={sidebarCollapsed ? label : undefined}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              sidebarCollapsed && 'justify-center',
              isActive
                ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon size={17} className="shrink-0" />
            {!sidebarCollapsed && <span className="font-medium text-[13px]">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 mx-2 mb-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 shrink-0"
      >
        {sidebarCollapsed
          ? <ChevronRight size={15} />
          : <><ChevronLeft size={15} /><span className="text-xs ml-1.5">Thu gọn</span></>
        }
      </button>
    </aside>
  )
}
