import { useNavigate } from 'react-router-dom'
import { ChevronRight, RotateCcw, Save, AlertCircle, Info } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import clsx from 'clsx'
import { useWeightStore } from '../../store/weightStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useStrategyStore } from '../../store/strategyStore.js'
import { mockPerspectiveRationale } from '../../data/mockWeights.js'
import { useState } from 'react'

const PERSPECTIVES = [
  { id: 'financial', label: 'Tài chính',             color: '#16a34a', light: '#dcfce7', icon: '💰' },
  { id: 'customer',  label: 'Khách hàng',            color: '#2563eb', light: '#dbeafe', icon: '👥' },
  { id: 'internal',  label: 'Quy trình nội bộ',      color: '#9333ea', light: '#f3e8ff', icon: '⚙️' },
  { id: 'learning',  label: 'Học hỏi & Phát triển', color: '#d97706', light: '#fef3c7', icon: '🌱' },
]

const PERSPECTIVE_OBJECTIVES = {
  financial: ['so-f1', 'so-f2', 'so-f3'],
  customer:  ['so-c1', 'so-c2', 'so-c3'],
  internal:  ['so-i1', 'so-i2', 'so-i3'],
  learning:  ['so-l1', 'so-l2', 'so-l3'],
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-slate-800 text-white rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold">{d.name}</p>
      <p className="text-blue-300">{d.value}%</p>
    </div>
  )
}

export default function WeightAllocationPage() {
  const { perspectiveWeights, objectiveWeights, setPerspectiveWeight, setObjectiveWeight, resetToDefault } = useWeightStore()
  const { markStepComplete } = useBSCWorkflowStore()
  const { objectives } = useStrategyStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('financial')
  const [saved, setSaved] = useState(false)

  const totalPerspective = Object.values(perspectiveWeights).reduce((a, b) => a + b, 0)

  const handleSave = () => {
    markStepComplete('B7')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const getObjectivesForPerspective = (perspectiveId) => {
    const ids = PERSPECTIVE_OBJECTIVES[perspectiveId] ?? []
    return ids.map((id) => {
      const obj = objectives.find((o) => o.id === id)
      return { id, label: obj?.title ?? id, weight: objectiveWeights[id] ?? 0 }
    })
  }

  const objectiveTotalForPerspective = (perspectiveId) => {
    const objs = getObjectivesForPerspective(perspectiveId)
    return objs.reduce((s, o) => s + o.weight, 0)
  }

  const donutData = PERSPECTIVES.map((p) => ({
    name: p.label,
    value: perspectiveWeights[p.id],
    color: p.color,
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Phân bổ Tỉ trọng</h1>
          <p className="text-sm text-slate-500 mt-1">Xác định tỉ trọng cho từng góc độ BSC và mục tiêu chiến lược</p>
        </div>
        <div className="flex gap-3">
          <button onClick={resetToDefault} className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-colors">
            <RotateCcw size={14} /> Đặt lại
          </button>
          <button
            onClick={handleSave}
            className={clsx(
              'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors',
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            )}
          >
            {saved ? '✓ Đã lưu!' : <><Save size={15} /> Lưu cấu hình</>}
          </button>
          <button onClick={() => navigate('/action-plan')} className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors">
            Tiếp theo <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Sliders */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-sm">Tỉ trọng Góc độ BSC</h2>
              <div className={clsx('flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
                totalPerspective === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
              )}>
                {totalPerspective === 100 ? '✓' : <AlertCircle size={12} />}
                Tổng: {totalPerspective}%
              </div>
            </div>

            <div className="space-y-5">
              {PERSPECTIVES.map((p) => {
                const val = perspectiveWeights[p.id]
                const isWarning = val < 5 || val > 60
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{p.icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{p.label}</span>
                        {isWarning && <AlertCircle size={13} className="text-amber-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0} max={100}
                          value={val}
                          onChange={(e) => setPerspectiveWeight(p.id, Math.max(0, Math.min(100, +e.target.value)))}
                          className="w-14 text-center text-sm font-bold border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
                        />
                        <span className="text-sm text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0} max={100} step={1}
                        value={val}
                        onChange={(e) => setPerspectiveWeight(p.id, +e.target.value)}
                        className="w-full h-2.5 rounded-full outline-none cursor-pointer appearance-none"
                        style={{ accentColor: p.color }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-300 mt-0.5">
                      <span>Tối thiểu 5%</span>
                      <span>Tối đa 60%</span>
                    </div>
                    {isWarning && (
                      <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                        <Info size={11} /> Nên trong khoảng 5%–60%
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{mockPerspectiveRationale[p.id]}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Objective weights */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              {PERSPECTIVES.map((p) => {
                const total = objectiveTotalForPerspective(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveTab(p.id)}
                    className={clsx(
                      'flex-1 flex flex-col items-center gap-0.5 px-2 py-3 text-xs font-medium transition-colors border-b-2',
                      activeTab === p.id ? 'border-b-2 bg-slate-50' : 'border-transparent hover:bg-slate-50 text-slate-500'
                    )}
                    style={activeTab === p.id ? { borderBottomColor: p.color, color: p.color } : {}}
                  >
                    <span>{p.icon}</span>
                    <span className="hidden sm:block text-[10px]">{p.label.split(' ')[0]}</span>
                    <span className={clsx('text-[10px] font-bold', total === 100 ? 'text-emerald-600' : 'text-red-500')}>
                      {total}%
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="p-5">
              {(() => {
                const p = PERSPECTIVES.find((p) => p.id === activeTab)
                const objs = getObjectivesForPerspective(activeTab)
                const total = objs.reduce((s, o) => s + o.weight, 0)
                const siblingIds = objs.map((o) => o.id)
                return (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-700">Mục tiêu chiến lược — {p?.label}</h3>
                      <div className={clsx('text-xs font-bold px-2 py-0.5 rounded-lg', total === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                        Tổng: {total}%
                      </div>
                    </div>
                    <div className="space-y-4">
                      {objs.map((obj) => {
                        const effectiveWeight = ((perspectiveWeights[activeTab] ?? 0) * obj.weight / 100).toFixed(1)
                        return (
                          <div key={obj.id}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm text-slate-700 flex-1 mr-3">{obj.label}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] text-slate-400">Hiệu lực: <strong className="text-slate-600">{effectiveWeight}%</strong></span>
                                <input
                                  type="number"
                                  min={0} max={100}
                                  value={obj.weight}
                                  onChange={(e) => setObjectiveWeight(obj.id, Math.max(0, Math.min(100, +e.target.value)), siblingIds)}
                                  className="w-14 text-center text-sm font-bold border border-slate-200 rounded-lg px-1 py-1 outline-none focus:border-blue-500"
                                />
                                <span className="text-xs text-slate-400">%</span>
                              </div>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${obj.weight}%`, background: p?.color }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Right: Donut + summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Phân bổ Tỉ trọng</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Effective weights table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Info size={14} className="text-blue-500" />
              Tỉ trọng Hiệu lực
            </h2>
            <p className="text-[11px] text-slate-400 mb-3">= Tỉ trọng Góc độ × Tỉ trọng Mục tiêu</p>
            <div className="space-y-2">
              {PERSPECTIVES.map((p) => {
                const objs = getObjectivesForPerspective(p.id)
                return objs.map((obj) => {
                  const eff = ((perspectiveWeights[p.id] ?? 0) * obj.weight / 100).toFixed(1)
                  return (
                    <div key={obj.id} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />
                      <span className="text-[11px] text-slate-600 flex-1 truncate">{obj.label}</span>
                      <span className="text-[11px] font-bold text-slate-800">{eff}%</span>
                    </div>
                  )
                })
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs font-bold">
              <span className="text-slate-500">Tổng cộng</span>
              <span className="text-slate-900">
                {PERSPECTIVES.reduce((sum, p) => {
                  return sum + getObjectivesForPerspective(p.id).reduce((s, o) => s + (perspectiveWeights[p.id] ?? 0) * o.weight / 100, 0)
                }, 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
