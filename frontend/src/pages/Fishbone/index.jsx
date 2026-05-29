import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, ChevronRight, X } from 'lucide-react'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'

const BRANCH_CATEGORIES = [
  { id: 'man',         label: 'Con người',    color: '#3b82f6',  angle: 45  },
  { id: 'machine',     label: 'Máy móc/CS',   color: '#8b5cf6',  angle: 45  },
  { id: 'method',      label: 'Phương pháp',  color: '#10b981',  angle: 45  },
  { id: 'material',    label: 'Nguyên vật liệu', color: '#f59e0b', angle: -45 },
  { id: 'measurement', label: 'Đo lường',     color: '#ef4444',  angle: -45 },
  { id: 'environment', label: 'Môi trường',   color: '#6366f1',  angle: -45 },
]

const EFFECT_OPTIONS = [
  { value: 'revenue',    label: 'Doanh thu tăng trưởng chậm' },
  { value: 'quality',    label: 'Chất lượng sản phẩm thấp' },
  { value: 'turnover',   label: 'Tỷ lệ nghỉ việc cao' },
  { value: 'cost',       label: 'Chi phí vận hành cao' },
  { value: 'customer',   label: 'Sự hài lòng khách hàng thấp' },
  { value: 'digital',    label: 'Chuyển đổi số chậm' },
]

const INITIAL_CAUSES = {
  man:         [{ id: 'c1', text: 'Thiếu kỹ năng BSC' }, { id: 'c2', text: 'Không có người chịu trách nhiệm' }],
  machine:     [{ id: 'c3', text: 'Hệ thống IT cũ' }, { id: 'c4', text: 'Thiếu phần mềm phân tích' }],
  method:      [{ id: 'c5', text: 'Quy trình báo cáo thủ công' }],
  material:    [{ id: 'c6', text: 'Dữ liệu không đầy đủ' }, { id: 'c7', text: 'Thiếu tiêu chuẩn đo lường' }],
  measurement: [{ id: 'c8', text: 'KPI không rõ ràng' }],
  environment: [{ id: 'c9', text: 'Văn hóa chưa đo lường hiệu suất' }],
}

const W = 860
const H = 480
const SPINE_Y = H / 2
const SPINE_X1 = 100
const SPINE_X2 = W - 140
const EFFECT_X = W - 50
const EFFECT_W = 120
const EFFECT_H = 60
const TOP_BRANCHES = BRANCH_CATEGORIES.filter((_, i) => i < 3)
const BOT_BRANCHES = BRANCH_CATEGORIES.filter((_, i) => i >= 3)

function getBranchCoords(index, isTop, totalTop, totalBot) {
  const group = isTop ? totalTop : totalBot
  const gap = (SPINE_X2 - SPINE_X1) / (group + 1)
  const x = SPINE_X1 + gap * (index + 1)
  const y = isTop ? 60 : H - 60
  return { x, y }
}

function CauseItemModal({ open, onClose, onAdd, categoryId }) {
  const { register, handleSubmit, reset } = useForm()
  if (!open) return null
  const onSubmit = (data) => { onAdd(categoryId, data.text); reset(); onClose() }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Thêm nguyên nhân</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mô tả nguyên nhân</label>
            <input
              {...register('text', { required: true })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              placeholder="Nguyên nhân cụ thể..."
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
            <button type="submit" className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function FishbonePage() {
  const { markStepComplete } = useBSCWorkflowStore()
  const navigate = useNavigate()
  const [effect, setEffect] = useState('revenue')
  const [causes, setCauses] = useState(INITIAL_CAUSES)
  const [modal, setModal] = useState({ open: false, categoryId: null })
  const [activeBranch, setActiveBranch] = useState(null)

  const addCause = (categoryId, text) => {
    const id = `c-new-${Date.now()}`
    setCauses((prev) => ({ ...prev, [categoryId]: [...(prev[categoryId] ?? []), { id, text }] }))
  }

  const deleteCause = (categoryId, id) => {
    setCauses((prev) => ({ ...prev, [categoryId]: prev[categoryId].filter((c) => c.id !== id) }))
  }

  const handleComplete = () => {
    markStepComplete('B5')
    navigate('/kpi-setup')
  }

  const effectLabel = EFFECT_OPTIONS.find((e) => e.value === effect)?.label ?? ''

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mô hình Xương cá</h1>
          <p className="text-sm text-slate-500 mt-1">Phân tích nguyên nhân gốc rễ của các vấn đề chiến lược</p>
        </div>
        <button onClick={handleComplete} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          Hoàn thành B5 <ChevronRight size={16} />
        </button>
      </div>

      {/* Effect selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
        <label className="text-sm font-semibold text-slate-700 shrink-0">Vấn đề cần phân tích:</label>
        <select
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 bg-white"
        >
          {EFFECT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Fishbone SVG */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="min-w-full">
            {/* Background */}
            <rect width={W} height={H} fill="#f8fafc" />

            {/* Spine */}
            <line x1={SPINE_X1} y1={SPINE_Y} x2={SPINE_X2} y2={SPINE_Y} stroke="#334155" strokeWidth={3} strokeLinecap="round" />

            {/* Arrow head */}
            <polygon points={`${SPINE_X2},${SPINE_Y} ${SPINE_X2 - 16},${SPINE_Y - 8} ${SPINE_X2 - 16},${SPINE_Y + 8}`} fill="#334155" />

            {/* Effect box */}
            <rect x={EFFECT_X - EFFECT_W / 2 + 10} y={SPINE_Y - EFFECT_H / 2} width={EFFECT_W} height={EFFECT_H} rx={10} fill="#1e293b" />
            <text x={EFFECT_X - EFFECT_W / 2 + 10 + EFFECT_W / 2} y={SPINE_Y - 8} textAnchor="middle" fill="white" fontSize={9} fontWeight="bold">VẤN ĐỀ</text>
            <foreignObject x={EFFECT_X - EFFECT_W / 2 + 14} y={SPINE_Y} width={EFFECT_W - 8} height={40}>
              <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '9px', color: '#94a3b8', lineHeight: '1.3', wordWrap: 'break-word' }}>
                {effectLabel}
              </div>
            </foreignObject>

            {/* Top branches */}
            {TOP_BRANCHES.map((cat, i) => {
              const { x, y } = getBranchCoords(i, true, TOP_BRANCHES.length, BOT_BRANCHES.length)
              const catCauses = causes[cat.id] ?? []
              return (
                <g key={cat.id}>
                  {/* Branch line */}
                  <line x1={x} y1={y} x2={x + (SPINE_Y - y) / Math.tan(Math.PI / 4)} y2={SPINE_Y} stroke={cat.color} strokeWidth={2.5} strokeLinecap="round" />
                  {/* Label box */}
                  <rect x={x - 45} y={y - 22} width={90} height={22} rx={6} fill={cat.color} />
                  <text x={x} y={y - 8} textAnchor="middle" fill="white" fontSize={10} fontWeight="bold">{cat.label}</text>
                  {/* Cause items */}
                  {catCauses.slice(0, 4).map((cause, ci) => (
                    <g key={cause.id}>
                      <line
                        x1={x - 30 + ci * 10} y1={y + 5}
                        x2={x - 30 + ci * 10} y2={y + 30 + ci * 12}
                        stroke={cat.color} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6}
                      />
                      <foreignObject x={x - 80 + ci * 5} y={y + 30 + ci * 12} width={150} height={20}>
                        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '9px', color: '#334155', backgroundColor: `${cat.color}18`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${cat.color}40`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cause.text}
                        </div>
                      </foreignObject>
                    </g>
                  ))}
                  {/* Add button */}
                  <g
                    onClick={() => setModal({ open: true, categoryId: cat.id })}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={x + 50} cy={y - 10} r={10} fill={cat.color} opacity={0.8} />
                    <text x={x + 50} y={y - 6} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">+</text>
                  </g>
                </g>
              )
            })}

            {/* Bottom branches */}
            {BOT_BRANCHES.map((cat, i) => {
              const { x, y } = getBranchCoords(i, false, TOP_BRANCHES.length, BOT_BRANCHES.length)
              const catCauses = causes[cat.id] ?? []
              return (
                <g key={cat.id}>
                  <line x1={x} y1={y} x2={x + (y - SPINE_Y) / Math.tan(Math.PI / 4)} y2={SPINE_Y} stroke={cat.color} strokeWidth={2.5} strokeLinecap="round" />
                  <rect x={x - 50} y={y} width={100} height={22} rx={6} fill={cat.color} />
                  <text x={x} y={y + 14} textAnchor="middle" fill="white" fontSize={10} fontWeight="bold">{cat.label}</text>
                  {catCauses.slice(0, 4).map((cause, ci) => (
                    <g key={cause.id}>
                      <line
                        x1={x - 20 + ci * 8} y1={y - 5}
                        x2={x - 20 + ci * 8} y2={y - 28 - ci * 12}
                        stroke={cat.color} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6}
                      />
                      <foreignObject x={x - 80 + ci * 5} y={y - 48 - ci * 12} width={150} height={20}>
                        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '9px', color: '#334155', backgroundColor: `${cat.color}18`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${cat.color}40`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cause.text}
                        </div>
                      </foreignObject>
                    </g>
                  ))}
                  <g onClick={() => setModal({ open: true, categoryId: cat.id })} style={{ cursor: 'pointer' }}>
                    <circle cx={x + 55} cy={y + 10} r={10} fill={cat.color} opacity={0.8} />
                    <text x={x + 55} y={y + 14} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">+</text>
                  </g>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Cause list panel */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {BRANCH_CATEGORIES.map((cat) => {
          const catCauses = causes[cat.id] ?? []
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 rounded-full px-1.5">{catCauses.length}</span>
                </div>
                <button
                  onClick={() => setModal({ open: true, categoryId: cat.id })}
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: cat.color }}
                >
                  <Plus size={12} className="text-white" />
                </button>
              </div>
              <div className="p-3 space-y-1.5 max-h-36 overflow-y-auto">
                {catCauses.length === 0 ? (
                  <p className="text-xs text-slate-300 italic text-center py-2">Chưa có nguyên nhân</p>
                ) : (
                  catCauses.map((cause) => (
                    <div key={cause.id} className="group flex items-center justify-between gap-2 text-xs text-slate-700 py-1 px-2 rounded-lg hover:bg-slate-50">
                      <span className="flex-1 leading-snug">{cause.text}</span>
                      <button
                        onClick={() => deleteCause(cat.id, cause.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={11} className="text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <CauseItemModal
        open={modal.open}
        onClose={() => setModal({ open: false, categoryId: null })}
        onAdd={addCause}
        categoryId={modal.categoryId}
      />
    </div>
  )
}
