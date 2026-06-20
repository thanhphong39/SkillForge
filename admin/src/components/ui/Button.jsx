import clsx from 'clsx'
const variants = { primary: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent', secondary: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300', danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent', ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent', success: 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent' }
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' }
export function Button({ variant = 'primary', size = 'md', className, disabled, children, icon, ...props }) {
  return <button className={clsx('inline-flex items-center gap-1.5 font-medium rounded-lg border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className)} disabled={disabled} {...props}>{icon && <span className="w-4 h-4">{icon}</span>}{children}</button>
}
