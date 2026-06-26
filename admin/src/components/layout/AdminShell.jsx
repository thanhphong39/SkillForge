import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from '../ui/toast.jsx'
import {
  Building2, Users, LayoutGrid, Settings, Calendar,
  ChevronLeft, ChevronRight, LayoutDashboard,
  LogOut, User, ChevronDown, Shield,
} from 'lucide-react'
import clsx from 'clsx'
import { useAdminAuthStore } from '../../store/adminAuthStore.js'
import { useAdminStore } from '../../store/adminStore.js'

const NAV = [
  { to: '/overview',      icon: LayoutDashboard, label: 'Tổng quan',          section: null },
  { to: '/company-setup', icon: Building2,        label: 'Cấu hình công ty',   section: 'Thiết lập' },
  { to: '/departments',   icon: LayoutGrid,       label: 'Phòng ban',          section: 'Thiết lập' },
  { to: '/users',         icon: Users,            label: 'Người dùng',         section: 'Thiết lập' },
  { to: '/periods',       icon: Calendar,         label: 'Kỳ BSC',             section: 'BSC' },
  { to: '/system-config', icon: Settings,         label: 'Cấu hình hệ thống',  section: 'BSC' },
]

const PAGE_TITLES = {
  '/overview':      'Tổng quan',
  '/company-setup': 'Cấu hình Công ty',
  '/departments':   'Quản lý Phòng ban',
  '/users':         'Quản lý Người dùng',
  '/periods':       'Quản lý Kỳ BSC',
  '/system-config': 'Cấu hình Hệ thống',
}

function UserMenu({ admin, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

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
          'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer',
          open ? 'bg-slate-100' : 'hover:bg-slate-50'
        )}
      >
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {admin?.avatar ?? 'AD'}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-slate-700 leading-tight">{admin?.name ?? 'Admin'}</div>
          <div className="text-xs text-slate-400">Quản trị viên</div>
        </div>
        <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-60 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {admin?.avatar ?? 'AD'}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">{admin?.name}</div>
                <div className="text-xs text-slate-500 truncate">{admin?.email}</div>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white bg-purple-600 inline-flex items-center gap-1">
                <Shield size={9} />
                Quản trị hệ thống
              </span>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={() => { onLogout(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium cursor-pointer"
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

export function AdminShell() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuthStore()
  const { company, init } = useAdminStore()

  useEffect(() => { init() }, [])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  // Group nav items by section
  const sections = []
  let currentSection = Symbol() // sentinel — never equals null or any string
  NAV.forEach((item) => {
    if (item.section !== currentSection) {
      currentSection = item.section
      sections.push({ label: item.section, items: [item] })
    } else {
      sections[sections.length - 1].items.push(item)
    }
  })

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Toaster />
      {/* Sidebar */}
      <aside className={clsx(
        'flex flex-col bg-slate-900 text-white transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}>
        {/* Logo */}
        <div className={clsx(
          'flex items-center h-16 px-4 border-b border-slate-700/60 shrink-0',
          collapsed ? 'justify-center' : 'gap-1'
        )}>
          <div className="w-16 h-16 flex items-center justify-center shrink-0 -ml-2">
            <img src="/logoSkill.png" alt="SkillForge Logo" className="w-full h-full object-contain scale-125" />
          </div>
          {!collapsed && (
            <div className="-ml-1 min-w-0">
              <div className="font-bold text-sm text-white leading-tight">SkillForge</div>
              <div className="text-slate-400 text-xs">Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {sections.map(({ label, items }) => (
            <div key={label ?? '__root'} className="mb-1">
              {!collapsed && label && (
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest px-3 py-2">
                  {label}
                </p>
              )}
              {items.map(({ to, icon: Icon, label: itemLabel }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={collapsed ? itemLabel : undefined}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    collapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon size={17} className="shrink-0" />
                  {!collapsed && <span className="font-medium truncate">{itemLabel}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center h-10 mx-2 mb-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors border border-slate-700/50 shrink-0"
        >
          {collapsed
            ? <ChevronRight size={15} />
            : <><ChevronLeft size={15} /><span className="text-xs ml-1.5">Thu gọn</span></>
          }
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-slate-800 truncate">
              {PAGE_TITLES[pathname] ?? 'Admin'}
            </h1>
            {company.name && (
              <p className="text-xs text-slate-400 leading-none mt-0.5 truncate">{company.name}</p>
            )}
          </div>

          <UserMenu admin={admin} onLogout={handleLogout} />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

