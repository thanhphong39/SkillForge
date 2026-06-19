import { useState, useRef, useEffect, useMemo } from 'react'
import { Bell, User, CheckCircle2, AlertTriangle, Clock, X, ChevronRight, LogOut, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, ROLES } from '../../store/authStore.js'
import { PeriodSelector } from '../shared/PeriodSelector.jsx'
import { mockCompany } from '../../data/mockCompany.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useActionPlanStore } from '../../store/actionPlanStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useWeightStore } from '../../store/weightStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useSWOTStore } from '../../store/swotStore.js'
import clsx from 'clsx'

const STEP_ROUTES = {
  B1: '/assessment',
  B2: '/strategy-build/swot',
  B3: '/strategy-results/selection',
  B4: '/strategy-map/perspectives',
  B5: '/fishbone',
  B6: '/weight-allocation',
  B7: '/kpi-setup',
  B8: '/action-plan',
}

function useNotifications() {
  const { steps } = useBSCWorkflowStore()
  const { tasks, actionPlans, kpiReports } = useActionPlanStore()
  const fishboneStore = useFishboneStore()
  const { perspectiveWeights } = useWeightStore()
  const strategyMapStore = useStrategyMapStore()
  const { b3Selected } = useSWOTStore()

  return useMemo(() => {
    const notes = []

    // 1. Bước đang active
    const activeStep = Object.entries(steps).find(([, s]) => s.status === 'active')
    if (activeStep) {
      notes.push({
        id: `active-${activeStep[0]}`,
        type: 'info',
        icon: Clock,
        title: `${activeStep[0]} đang thực hiện`,
        body: `Bước "${activeStep[1].label}" chưa hoàn thành`,
        to: STEP_ROUTES[activeStep[0]],
      })
    }

    // 2. Tasks bị BLOCKED
    const blocked = tasks.filter((t) => t.status === 'BLOCKED')
    if (blocked.length > 0) {
      blocked.slice(0, 3).forEach((t) => {
        const ap = actionPlans.find((a) => a.id === t.actionPlanId)
        notes.push({
          id: `blocked-${t.id}`,
          type: 'error',
          icon: AlertTriangle,
          title: 'Task bị chặn (BLOCKED)',
          body: `"${t.name}"${ap ? ` — ${ap.name}` : ''}${t.blockReason ? `: ${t.blockReason}` : ''}`,
          to: '/action-plan',
        })
      })
      if (blocked.length > 3) {
        notes.push({
          id: 'blocked-more',
          type: 'error',
          icon: AlertTriangle,
          title: `+${blocked.length - 3} task BLOCKED khác`,
          body: 'Xem toàn bộ trong Action Plan',
          to: '/action-plan',
        })
      }
    }

    // 3. Tỉ trọng B6 chưa hợp lệ (nếu B6 chưa hoàn thành)
    if (steps.B6?.status !== 'completed') {
      const total = Object.values(perspectiveWeights).reduce((a, b) => a + b, 0)
      if (total !== 100 && total > 0) {
        notes.push({
          id: 'weight-invalid',
          type: 'warning',
          icon: AlertTriangle,
          title: 'Tỉ trọng B6 chưa hợp lệ',
          body: `Tổng 4 góc độ đang = ${total}% (cần = 100%)`,
          to: '/weight-allocation',
        })
      }
    }

    // 4. Báo cáo KPI mới nhất (B8)
    const latestReports = [...kpiReports]
      .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))
      .slice(0, 2)
    latestReports.forEach((r) => {
      const objectives = strategyMapStore.getEffectiveFinalObjectives(b3Selected)
      const allKpis = fishboneStore.getAllKPIs(objectives)
      const kpi = allKpis.find((k) => k.id === r.kpiId)
      notes.push({
        id: `report-${r.id}`,
        type: 'success',
        icon: CheckCircle2,
        title: 'Báo cáo KPI mới',
        body: `${kpi?.name ?? 'KPI'}: ${r.actualValue} (${r.reportedAt})`,
        to: '/action-plan',
      })
    })

    // 5. Các bước đã hoàn thành gần đây (theo ngày)
    const recentDone = Object.entries(steps)
      .filter(([, s]) => s.status === 'completed' && s.completedAt)
      .sort((a, b) => (b[1].completedAt ?? '').localeCompare(a[1].completedAt ?? ''))
      .slice(0, 2)
    recentDone.forEach(([id, s]) => {
      notes.push({
        id: `done-${id}`,
        type: 'success',
        icon: CheckCircle2,
        title: `${id} hoàn thành`,
        body: `"${s.label}" — ${s.completedAt}`,
        to: STEP_ROUTES[id],
      })
    })

    return notes
  }, [steps, tasks, actionPlans, kpiReports, perspectiveWeights, b3Selected])
}

const TYPE_STYLE = {
  info:    { bg: 'bg-blue-50',   border: 'border-blue-100',   icon: 'text-blue-500',   dot: 'bg-blue-500' },
  success: { bg: 'bg-emerald-50',border: 'border-emerald-100',icon: 'text-emerald-500',dot: 'bg-emerald-500' },
  warning: { bg: 'bg-amber-50',  border: 'border-amber-100',  icon: 'text-amber-500',  dot: 'bg-amber-500' },
  error:   { bg: 'bg-red-50',    border: 'border-red-100',    icon: 'text-red-500',    dot: 'bg-red-500' },
}

function NotificationPanel({ notifications, onClose, navigate }) {
  const [dismissed, setDismissed] = useState(new Set())
  const visible = notifications.filter((n) => !dismissed.has(n.id))

  return (
    <div className="absolute right-0 mt-2 z-50 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-slate-600" />
          <span className="text-sm font-bold text-slate-700">Thông báo</span>
          {visible.length > 0 && (
            <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
              {visible.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {visible.length > 0 && (
            <button
              onClick={() => setDismissed(new Set(notifications.map((n) => n.id)))}
              className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              Xóa tất cả
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {visible.length === 0 ? (
          <div className="py-10 text-center">
            <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-sm text-slate-500 font-medium">Không có thông báo mới</p>
            <p className="text-xs text-slate-400 mt-0.5">Mọi thứ đang ổn!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {visible.map((n) => {
              const s = TYPE_STYLE[n.type] ?? TYPE_STYLE.info
              const Icon = n.icon
              return (
                <div
                  key={n.id}
                  className={clsx('flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group', s.bg)}
                >
                  <div className={clsx('mt-0.5 shrink-0', s.icon)}>
                    <Icon size={15} />
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => { if (n.to) { navigate(n.to); onClose() } }}
                  >
                    <p className="text-xs font-semibold text-slate-800 leading-snug">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {n.to && (
                      <button
                        onClick={() => { navigate(n.to); onClose() }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500"
                      >
                        <ChevronRight size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => setDismissed((s) => new Set([...s, n.id]))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {visible.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => { navigate('/dashboard'); onClose() }}
            className="text-xs text-blue-600 hover:underline font-medium w-full text-center"
          >
            Xem tổng quan Dashboard →
          </button>
        </div>
      )}
    </div>
  )
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const role = ROLES[user?.role]

  useEffect(() => {
    if (!open) return
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer rounded-lg pr-2 py-1 transition-colors',
          open ? 'bg-slate-100' : 'hover:bg-slate-50'
        )}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: role?.color ?? '#3b82f6' }}
        >
          {user?.avatar ?? <User size={14} />}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-slate-700 leading-tight">{user?.name ?? 'Người dùng'}</div>
          <div className="text-xs text-slate-400">{user?.title ?? ''}</div>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
          {/* User info */}
          <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: role?.color ?? '#3b82f6' }}
              >
                {user?.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate">{user?.title}</div>
                {user?.deptName && (
                  <div className="text-[10px] text-slate-400 truncate">{user.deptName}</div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ background: role?.color ?? '#3b82f6' }}
              >
                <Shield size={9} className="inline mr-1" />
                {role?.label}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={() => { onLogout(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Header({ title }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const notifications = useNotifications()

  const unread = notifications.length

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Click outside to close notification panel
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-slate-800">{title || mockCompany.name}</h1>

      <div className="flex items-center gap-3">
        <PeriodSelector />

        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              'relative p-2 rounded-lg transition-colors',
              open
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            )}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-0.5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-white leading-none">
                  {unread > 9 ? '9+' : unread}
                </span>
              </span>
            )}
          </button>

          {open && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setOpen(false)}
              navigate={navigate}
            />
          )}
        </div>

        {/* User menu */}
        <UserMenu user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}
