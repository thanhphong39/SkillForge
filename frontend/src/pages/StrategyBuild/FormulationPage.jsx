import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CheckSquare, Square, ArrowUpRight, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useSWOTStore } from '../../store/swotStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'

const TYPE_META = {
  SO: { label: 'SO — Tấn công',       description: 'Điểm mạnh × Cơ hội',     color: 'emerald', bg: 'bg-emerald-50',  border: 'border-emerald-200', badge: 'bg-emerald-600 text-white', dot: 'bg-emerald-500' },
  ST: { label: 'ST — Phòng thủ',      description: 'Điểm mạnh × Thách thức', color: 'blue',    bg: 'bg-blue-50',     border: 'border-blue-200',    badge: 'bg-blue-600 text-white',    dot: 'bg-blue-500' },
  WO: { label: 'WO — Củng cố',        description: 'Điểm yếu × Cơ hội',      color: 'purple',  bg: 'bg-purple-50',   border: 'border-purple-200',  badge: 'bg-purple-600 text-white',  dot: 'bg-purple-500' },
  WT: { label: 'WT — Hạn chế rủi ro', description: 'Điểm yếu × Thách thức', color: 'amber',   bg: 'bg-amber-50',    border: 'border-amber-200',   badge: 'bg-amber-600 text-white',   dot: 'bg-amber-500' },
}

const PRIORITY_OPTIONS = [
  { value: 'high',   label: 'Ưu tiên cao',   cls: 'text-rose-600 bg-rose-50 border-rose-200' },
  { value: 'medium', label: 'Ưu tiên vừa',   cls: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'low',    label: 'Ưu tiên thấp',  cls: 'text-slate-500 bg-slate-50 border-slate-200' },
]

const SWOT_ITEM_LABEL = { strength: 'S', weakness: 'W', opportunity: 'O', threat: 'T' }
const SWOT_ITEM_COLOR = { strength: 'bg-emerald-100 text-emerald-700', weakness: 'bg-red-100 text-red-700', opportunity: 'bg-blue-100 text-blue-700', threat: 'bg-amber-100 text-amber-700' }

function StrategyCard({ strategy, swotItems, onToggle, onPriority }) {
  const meta = TYPE_META[strategy.type]
  const [expanded, setExpanded] = useState(false)
  const linkedItems = swotItems.filter((i) =>
    [...strategy.relatedStrengths, ...strategy.relatedOpportunities,
     ...strategy.relatedWeaknesses, ...strategy.relatedThreats].includes(i.id)
  )
  const priorityMeta = PRIORITY_OPTIONS.find((p) => p.value === strategy.priority)

  return (
    <div className={clsx(
      'rounded-2xl border transition-all duration-200',
      meta.border, meta.bg,
      strategy.selected && 'ring-2 ring-blue-500/40 shadow-md'
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button onClick={() => onToggle(strategy.id)} className="mt-0.5 shrink-0">
            {strategy.selected
              ? <CheckSquare size={18} className="text-blue-600" />
              : <Square size={18} className="text-slate-300 hover:text-slate-500 transition-colors" />
            }
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${meta.badge}`}>{strategy.type}</span>
              <select
                value={strategy.priority}
                onChange={(e) => onPriority(strategy.id, e.target.value)}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border cursor-pointer outline-none ${priorityMeta?.cls}`}
              >
                {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <h3 className="text-sm font-bold text-slate-800 leading-snug">{strategy.title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{strategy.description}</p>

            {/* Linked SWOT items */}
            {linkedItems.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {linkedItems.map((item) => (
                  <span key={item.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SWOT_ITEM_COLOR[item.quadrant]}`}>
                    {SWOT_ITEM_LABEL[item.quadrant]}: {item.title.substring(0, 20)}{item.title.length > 20 ? '…' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronDown size={13} className={clsx('text-slate-400 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-200/60 ml-7">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Tính khả thi</p>
                <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${strategy.feasibility}%` }} />
                </div>
                <p className="text-slate-600 font-semibold mt-0.5">{strategy.feasibility}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Mức độ tác động</p>
                <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${strategy.impact}%` }} />
                </div>
                <p className="text-slate-600 font-semibold mt-0.5">{strategy.impact}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FormulationPage() {
  const { items, strategies, toggleStrategySelected, setStrategyPriority } = useSWOTStore()
  const { markStepComplete } = useBSCWorkflowStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('SO')

  const types = ['SO', 'ST', 'WO', 'WT']
  const selectedCount = strategies.filter((s) => s.selected).length

  const handleComplete = () => {
    markStepComplete('B2')
    navigate('/strategy-results/selection')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xây dựng Chiến lược</h1>
          <p className="text-sm text-slate-500 mt-1">Phân tích các tổ hợp SWOT để hình thành chiến lược</p>
        </div>
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          Hoàn thành B2
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {types.map((type) => {
            const meta = TYPE_META[type]
            const count = strategies.filter((s) => s.type === type).length
            const selected = strategies.filter((s) => s.type === type && s.selected).length
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-1 px-4 py-3.5 text-sm font-semibold transition-colors border-b-2',
                  activeTab === type
                    ? `border-b-2 text-${meta.color}-700 border-${meta.color}-500 bg-${meta.color}-50/50`
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded', meta.badge)}>{type}</span>
                  <span className="hidden sm:inline text-xs">{meta.description}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400">{count} chiến lược</span>
                  {selected > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-1.5 rounded-full font-bold">✓ {selected}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="p-5">
          {/* Info bar */}
          <div className={clsx('rounded-xl p-3 mb-4 flex items-center gap-3', TYPE_META[activeTab].bg, `border ${TYPE_META[activeTab].border}`)}>
            <ArrowUpRight size={16} className={`text-${TYPE_META[activeTab].color}-600`} />
            <div>
              <p className={`text-xs font-bold text-${TYPE_META[activeTab].color}-700`}>{TYPE_META[activeTab].label}</p>
              <p className="text-[11px] text-slate-500">Chọn các chiến lược phù hợp với định hướng công ty</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-lg font-bold text-slate-800">
                {strategies.filter((s) => s.type === activeTab && s.selected).length}
                <span className="text-sm text-slate-400">/{strategies.filter((s) => s.type === activeTab).length}</span>
              </div>
              <div className="text-[10px] text-slate-400">đã chọn</div>
            </div>
          </div>

          {/* Strategy cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {strategies.filter((s) => s.type === activeTab).map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                swotItems={items}
                onToggle={toggleStrategySelected}
                onPriority={setStrategyPriority}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-blue-600">{selectedCount}</div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Chiến lược đã chọn</p>
            <p className="text-xs text-slate-400">Sẽ được đưa vào Bước 3 để đánh giá</p>
          </div>
        </div>
        <div className="flex gap-2">
          {types.map((t) => {
            const sel = strategies.filter((s) => s.type === t && s.selected).length
            return sel > 0 ? (
              <span key={t} className={`text-xs font-bold px-2 py-1 rounded-lg ${TYPE_META[t].badge}`}>
                {t}: {sel}
              </span>
            ) : null
          })}
        </div>
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Tiếp theo <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
