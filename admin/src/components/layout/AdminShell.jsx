import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Building2, Users, LayoutGrid, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/company-setup',  icon: Building2,  label: 'Cấu hình công ty' },
  { to: '/departments',    icon: LayoutGrid, label: 'Phòng ban' },
  { to: '/users',          icon: Users,      label: 'Người dùng' },
  { to: '/system-config',  icon: Settings,   label: 'Cấu hình hệ thống' },
]

const PAGE_TITLES = {
  '/company-setup': 'Cấu hình Công ty',
  '/departments':   'Quản lý Phòng ban',
  '/users':         'Quản lý Người dùng',
  '/system-config': 'Cấu hình Hệ thống',
}

export function AdminShell() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className={clsx('flex flex-col bg-slate-900 text-white transition-all duration-300 flex-shrink-0', collapsed ? 'w-16' : 'w-60')}>
        <div className={clsx('flex items-center h-16 px-4 border-b border-slate-700', collapsed ? 'justify-center' : 'gap-2')}>
          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!collapsed && <div><div className="font-bold text-sm">Admin Panel</div><div className="text-slate-400 text-xs">BSC-KPI System</div></div>}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors', isActive ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white')} title={collapsed ? label : undefined}>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setCollapsed(c => !c)} className="flex items-center justify-center h-10 mx-2 mb-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors">
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs ml-1">Thu gọn</span></>}
        </button>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-base font-semibold text-slate-800">{PAGE_TITLES[pathname] || 'Admin'}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Đang đăng nhập với vai trò: </span>
            <span className="font-semibold text-purple-600">Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  )
}
