import { Bell, User } from 'lucide-react'
import { PeriodSelector } from '../shared/PeriodSelector.jsx'
import { mockCompany } from '../../data/mockCompany.js'

export function Header({ title }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-slate-800">{title || mockCompany.name}</h1>
      <div className="flex items-center gap-3">
        <PeriodSelector />
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-700 leading-tight">Nguyễn Thành Công</div>
            <div className="text-xs text-slate-400">Giám đốc</div>
          </div>
        </div>
      </div>
    </header>
  )
}
