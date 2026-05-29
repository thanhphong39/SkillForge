import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Target, TrendingUp, Calendar } from 'lucide-react'
import clsx from 'clsx'
import { useSWOTStore } from '../../store/swotStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'

const TYPE_META = {
  SO: { badge: 'bg-emerald-600 text-white' },
  ST: { badge: 'bg-blue-600 text-white' },
  WO: { badge: 'bg-purple-600 text-white' },
  WT: { badge: 'bg-amber-600 text-white' },
}

const PERSPECTIVE_OPTIONS = [
  { value: 'financial', label: 'Tài chính',             color: 'emerald' },
  { value: 'customer',  label: 'Khách hàng',            color: 'blue' },
  { value: 'internal',  label: 'Quy trình nội bộ',      color: 'purple' },
  { value: 'learning',  label: 'Học hỏi & Phát triển', color: 'amber' },
]
const PERSPECTIVE_CLS = {
  financial: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  customer:  'bg-blue-50 border-blue-200 text-blue-700',
  internal:  'bg-purple-50 border-purple-200 text-purple-700',
  learning:  'bg-amber-50 border-amber-200 text-amber-700',
}

const initialOutcomes = (strategies) =>
  strategies.reduce((acc, s) => {
    acc[s.id] = { perspectiveId: 'financial', baseline: '', target: '', unit: '', year: '2024', successStatement: '' }
    return acc
  }, {})

export default function OutcomesPage() {
  const { strategies } = useSWOTStore()
  const { markStepComplete } = useBSCWorkflowStore()
  const navigate = useNavigate()

  const selected = strategies.filter((s) => s.selected)
  const [outcomes, setOutcomes] = useState(() => initialOutcomes(selected))
  const [groupBy, setGroupBy] = useState('strategy')

  const update = (strategyId, field, value) =>
    setOutcomes((prev) => ({ ...prev, [strategyId]: { ...prev[strategyId], [field]: value } }))

  const handleComplete = () => {
    markStepComplete('B3')
    navigate('/strategy-map/perspectives')
  }

  if (selected.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Target size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-600 mb-2">Chưa có chiến lược nào được chọn</h2>
        <p className="text-slate-400 text-sm mb-6">Quay lại Bước 2 để chọn chiến lược trước</p>
        <button onClick={() => navigate('/strategy-build/formulate')} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl">
          Quay lại B2
        </button>
      </div>
    )
  }

  const byPerspective = PERSPECTIVE_OPTIONS.map((p) => ({
    ...p,
    items: selected.filter((s) => outcomes[s.id]?.perspectiveId === p.value),
  })).filter((p) => p.items.length > 0)

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kết quả Chiến lược</h1>
          <p className="text-sm text-slate-500 mt-1">Định nghĩa kết quả kỳ vọng cho {selected.length} chiến lược được chọn</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            <button onClick={() => setGroupBy('strategy')} className={clsx('px-3 py-1.5 text-xs font-medium transition-colors', groupBy === 'strategy' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50')}>Theo chiến lược</button>
            <button onClick={() => setGroupBy('perspective')} className={clsx('px-3 py-1.5 text-xs font-medium transition-colors', groupBy === 'perspective' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50')}>Theo góc độ</button>
          </div>
          <button onClick={handleComplete} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
            Hoàn thành B3 <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {groupBy === 'strategy' ? (
        <div className="space-y-4">
          {selected.map((strategy) => {
            const o = outcomes[strategy.id] ?? {}
            const pMeta = PERSPECTIVE_OPTIONS.find((p) => p.value === o.perspectiveId)
            return (
              <div key={strategy.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${TYPE_META[strategy.type]?.badge}`}>{strategy.type}</span>
                  <h3 className="font-semibold text-slate-800 text-sm flex-1">{strategy.title}</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label-xs">Trạng thái thành công (Định nghĩa "Done")</label>
                    <textarea
                      className="input-field resize-none"
                      rows={2}
                      placeholder="Khi chiến lược thành công, chúng ta sẽ thấy..."
                      value={o.successStatement}
                      onChange={(e) => update(strategy.id, 'successStatement', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-xs">Góc độ BSC</label>
                    <select className="input-field" value={o.perspectiveId} onChange={(e) => update(strategy.id, 'perspectiveId', e.target.value)}>
                      {PERSPECTIVE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-xs">Năm mục tiêu</label>
                    <select className="input-field" value={o.year} onChange={(e) => update(strategy.id, 'year', e.target.value)}>
                      {['2024','2025','2026'].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-xs">Giá trị Baseline (hiện tại)</label>
                    <div className="flex gap-2">
                      <input className="input-field flex-1" placeholder="0" value={o.baseline} onChange={(e) => update(strategy.id, 'baseline', e.target.value)} />
                      <input className="input-field w-24" placeholder="Đơn vị" value={o.unit} onChange={(e) => update(strategy.id, 'unit', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label-xs">Giá trị Target (mục tiêu)</label>
                    <input className="input-field" placeholder="Mục tiêu cần đạt" value={o.target} onChange={(e) => update(strategy.id, 'target', e.target.value)} />
                  </div>
                </div>
                {o.perspectiveId && (
                  <div className={clsx('mx-5 mb-4 px-3 py-2 rounded-xl border text-xs font-medium', PERSPECTIVE_CLS[o.perspectiveId])}>
                    <TrendingUp size={12} className="inline mr-1" />
                    Góc độ: <strong>{pMeta?.label}</strong>
                    {o.baseline && o.target && (
                      <span className="ml-3 opacity-80">
                        {o.baseline} {o.unit} → {o.target} {o.unit}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {byPerspective.map((p) => (
            <div key={p.value} className={clsx('rounded-2xl border p-5', PERSPECTIVE_CLS[p.value])}>
              <h3 className="font-bold text-sm mb-3">{p.label} — {p.items.length} chiến lược</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.items.map((s) => {
                  const o = outcomes[s.id] ?? {}
                  return (
                    <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TYPE_META[s.type]?.badge}`}>{s.type}</span>
                        <span className="text-xs font-semibold text-slate-700 truncate">{s.title}</span>
                      </div>
                      {o.baseline && o.target && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Calendar size={11} className="text-slate-400" />
                          <span>{o.year}</span>
                          <span className="font-semibold text-slate-800">{o.baseline} → {o.target} {o.unit}</span>
                        </div>
                      )}
                      {o.successStatement && <p className="text-[11px] text-slate-500 mt-1 italic leading-snug">{o.successStatement}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .label-xs { display:block; font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.05em; margin-bottom:4px; }
        .input-field { width:100%; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; font-size:13px; outline:none; transition:border-color .15s; background:white; }
        .input-field:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
      `}</style>
    </div>
  )
}
