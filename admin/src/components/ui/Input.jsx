import clsx from 'clsx'
export function Input({ label, error, className, ...props }) {
  return <div className="w-full">{label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}<input className={clsx('w-full rounded-lg border px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500', error ? 'border-red-400' : 'border-slate-300', className)} {...props} />{error && <p className="mt-1 text-xs text-red-500">{error}</p>}</div>
}
export function Select({ label, error, children, className, ...props }) {
  return <div className="w-full">{label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}<select className={clsx('w-full rounded-lg border px-3 py-2 text-sm text-slate-800 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500', error ? 'border-red-400' : 'border-slate-300', className)} {...props}>{children}</select>{error && <p className="mt-1 text-xs text-red-500">{error}</p>}</div>
}
export function Textarea({ label, error, className, ...props }) {
  return <div className="w-full">{label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}<textarea className={clsx('w-full rounded-lg border px-3 py-2 text-sm text-slate-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500', error ? 'border-red-400' : 'border-slate-300', className)} rows={3} {...props} />{error && <p className="mt-1 text-xs text-red-500">{error}</p>}</div>
}
