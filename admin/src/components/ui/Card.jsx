import clsx from 'clsx'
export function Card({ className, children, padding = true, ...props }) {
  return <div className={clsx('bg-white rounded-xl border border-slate-200 shadow-sm', padding && 'p-5', className)} {...props}>{children}</div>
}
export function CardHeader({ title, subtitle, action, className }) {
  return <div className={clsx('flex items-start justify-between mb-4', className)}><div><h3 className="font-semibold text-slate-800 text-base">{title}</h3>{subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}</div>{action && <div className="flex-shrink-0 ml-4">{action}</div>}</div>
}
