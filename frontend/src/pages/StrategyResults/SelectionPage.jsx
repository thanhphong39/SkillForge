import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CheckSquare, Square, TrendingUp, Target } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import clsx from 'clsx'
import { useSWOTStore } from '../../store/swotStore.js'

const TYPE_META = {
  SO: { badge: 'bg-emerald-600 text-white', dot: '#10b981' },
  ST: { badge: 'bg-blue-600 text-white',    dot: '#3b82f6' },
  WO: { badge: 'bg-purple-600 text-white',  dot: '#8b5cf6' },
  WT: { badge: 'bg-amber-600 text-white',   dot: '#f59e0b' },
}
const PRIORITY_LABEL = { high: 'Cao', medium: 'Vừa', low: 'Thấp' }
const PRIORITY_CLS   = { high: 'text-rose-600 bg-rose-50', medium: 'text-amber-600 bg-amber-50', low: 'text-slate-500 bg-slate-50' }

const CustomDot = (props) => {
  const { cx, cy, payload } = props
  const color = TYPE_META[payload.type]?.dot ?? '#64748b'
  const r = payload.selected ? 10 : 7
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 4} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={payload.selected ? 1 : 0.5} stroke="white" strokeWidth={2} />
      <text x={cx} y={cy - r - 4} textAnchor="middle" fill={color} fontSize={10} fontWeight="bold">{payload.type}</text>
    </g>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 text-white rounded-xl p-3 text-xs shadow-xl max-w-48">
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TYPE_META[d.type]?.badge}`}>{d.type}</span>
      <p className="font-semibold mt-1 leading-snug">{d.title}</p>
      <p className="text-slate-300 mt-1">Khả thi: {d.feasibility}%</p>
      <p className="text-slate-300">Tác động: {d.impact}%</p>
    </div>
  )
}

export default function SelectionPage() {
  const { strategies, toggleStrategySelected } = useSWOTStore()
  const navigate = useNavigate()
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const filtered = strategies.filter((s) => {
    if (filterType !== 'all' && s.type !== filterType) return false
    if (filterPriority !== 'all' && s.priority !== filterPriority) return false
    return true
  })

  const selectedStrategies = strategies.filter((s) => s.selected)

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lựa chọn Chiến lược</h1>
          <p className="text-sm text-slate-500 mt-1">Đánh giá và ưu tiên hóa các chiến lược theo tính khả thi và tác động</p>
        </div>
        <button
          onClick={() => navigate('/strategy-results/outcomes')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          Xem kết quả <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Scatter chart */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">Ma trận Ưu tiên Chiến lược</h2>
              <p className="text-xs text-slate-400 mt-0.5">Trục X = Tính khả thi · Trục Y = Mức độ tác động</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TYPE_META).map(([t, m]) => (
                <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${m.badge}`}>{t}</span>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="feasibility" domain={[0, 100]} name="Khả thi" unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} label={{ value: 'Tính khả thi (%)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="impact" domain={[0, 100]} name="Tác động" unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} label={{ value: 'Tác động (%)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#94a3b8' }} />
                <ReferenceLine x={60} stroke="#e2e8f0" strokeDasharray="4 2" />
                <ReferenceLine y={60} stroke="#e2e8f0" strokeDasharray="4 2" />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={strategies} shape={<CustomDot />}>
                  {strategies.map((s, i) => <Cell key={i} fill={TYPE_META[s.type]?.dot ?? '#64748b'} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-400">
            <div className="bg-emerald-50 rounded-lg p-2 text-center"><span className="font-semibold text-emerald-700">Ưu tiên cao</span><br />Khả thi cao · Tác động cao</div>
            <div className="bg-blue-50 rounded-lg p-2 text-center"><span className="font-semibold text-blue-700">Theo dõi</span><br />Khả thi thấp · Tác động cao</div>
            <div className="bg-amber-50 rounded-lg p-2 text-center"><span className="font-semibold text-amber-700">Bổ sung</span><br />Khả thi cao · Tác động thấp</div>
            <div className="bg-slate-50 rounded-lg p-2 text-center"><span className="font-semibold text-slate-600">Xem xét lại</span><br />Khả thi thấp · Tác động thấp</div>
          </div>
        </div>

        {/* Ranking table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Target size={15} className="text-blue-600" /> Danh sách Chiến lược
            </h2>
            <div className="flex gap-2 mt-3">
              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none text-slate-600 flex-1"
                value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Tất cả loại</option>
                {['SO','ST','WO','WT'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none text-slate-600 flex-1"
                value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="all">Tất cả ưu tiên</option>
                <option value="high">Ưu tiên cao</option>
                <option value="medium">Ưu tiên vừa</option>
                <option value="low">Ưu tiên thấp</option>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.map((s, i) => (
              <div key={s.id} className={clsx('px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors', s.selected && 'bg-blue-50/40')}>
                <span className="text-xs font-bold text-slate-300 w-5 shrink-0 mt-0.5">{i + 1}</span>
                <button onClick={() => toggleStrategySelected(s.id)} className="mt-0.5 shrink-0">
                  {s.selected ? <CheckSquare size={15} className="text-blue-600" /> : <Square size={15} className="text-slate-300" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TYPE_META[s.type]?.badge}`}>{s.type}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${PRIORITY_CLS[s.priority]}`}>{PRIORITY_LABEL[s.priority]}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{s.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <TrendingUp size={10} /> {s.impact}%
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Target size={10} /> {s.feasibility}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">{selectedStrategies.length} đã chọn / {strategies.length} tổng</span>
            <button
              onClick={() => navigate('/strategy-results/outcomes')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Xem kết quả <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
