import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Edit3, Save, X, Eye, Plus, Trash2 } from 'lucide-react'
import { useStrategyStore } from '../../store/strategyStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'

const DEFAULT_PERSPECTIVES = [
  {
    id: 'financial',
    name: 'Tài chính',
    nameEn: 'Financial',
    description: 'Đo lường hiệu quả tài chính và tạo ra giá trị cho cổ đông',
    color: '#16a34a',
    icon: '💰',
    colorPresets: ['#16a34a', '#059669', '#0d9488', '#15803d'],
  },
  {
    id: 'customer',
    name: 'Khách hàng',
    nameEn: 'Customer',
    description: 'Tập trung vào sự hài lòng, giữ chân và thu hút khách hàng',
    color: '#2563eb',
    icon: '👥',
    colorPresets: ['#2563eb', '#3b82f6', '#0ea5e9', '#6366f1'],
  },
  {
    id: 'internal',
    name: 'Quy trình nội bộ',
    nameEn: 'Internal Process',
    description: 'Cải tiến quy trình vận hành cốt lõi tạo ra giá trị',
    color: '#9333ea',
    icon: '⚙️',
    colorPresets: ['#9333ea', '#7c3aed', '#6d28d9', '#a855f7'],
  },
  {
    id: 'learning',
    name: 'Học hỏi & Phát triển',
    nameEn: 'Learning & Growth',
    description: 'Phát triển con người, văn hóa và công nghệ hỗ trợ chiến lược',
    color: '#d97706',
    icon: '🌱',
    colorPresets: ['#d97706', '#f59e0b', '#ea580c', '#dc2626'],
  },
]

const STRATEGY_COLORS = ['#2563eb', '#9333ea', '#16a34a', '#d97706', '#dc2626', '#0891b2']

function PerspectiveCard({ perspective, objectives, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(perspective)

  const handleSave = () => { onSave(perspective.id, draft); setEditing(false) }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-1.5 w-full" style={{ background: perspective.color }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm" style={{ background: `${perspective.color}18`, border: `1.5px solid ${perspective.color}40` }}>
              {perspective.icon}
            </div>
            <div>
              {editing ? (
                <input
                  className="text-base font-bold text-slate-800 bg-transparent border-b-2 border-blue-500 outline-none w-48"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              ) : (
                <h3 className="font-bold text-slate-800">{perspective.name}</h3>
              )}
              <p className="text-xs text-slate-400">{perspective.nameEn}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {editing ? (
              <>
                <button onClick={handleSave} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg transition-colors"><Save size={12} /> Lưu</button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 bg-slate-50 px-2 py-1 rounded-lg transition-colors"><X size={12} /></button>
              </>
            ) : (
              <button onClick={() => { setDraft(perspective); setEditing(true) }} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg transition-colors"><Edit3 size={12} /> Sửa</button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="label-xs">Mô tả</label>
              <textarea className="input-sm resize-none" rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div>
              <label className="label-xs">Màu chủ đề</label>
              <div className="flex gap-2 items-center">
                {draft.colorPresets.map((c) => (
                  <button
                    key={c}
                    onClick={() => setDraft({ ...draft, color: c })}
                    className="w-7 h-7 rounded-lg border-2 transition-all"
                    style={{ background: c, borderColor: draft.color === c ? '#1e293b' : 'transparent' }}
                  />
                ))}
                <input type="color" value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 leading-relaxed mb-4">{perspective.description}</p>
        )}

        <div className="mt-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Mục tiêu chiến lược ({objectives.length})
          </p>
          <div className="space-y-1.5">
            {objectives.length === 0 ? (
              <p className="text-xs text-slate-300 italic">Chưa có mục tiêu nào</p>
            ) : (
              objectives.map((obj) => (
                <div key={obj.id} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-50 text-xs text-slate-700">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: perspective.color }} />
                  {obj.title}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .label-xs { display:block; font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.05em; margin-bottom:4px; }
        .input-sm { width:100%; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; font-size:13px; outline:none; transition:border-color .15s; background:white; }
        .input-sm:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
      `}</style>
    </div>
  )
}

export default function PerspectivesPage() {
  const { strategySets, activeStrategyId, setActiveStrategy, addStrategy, deleteStrategy } = useStrategyStore()
  const { markStepComplete } = useBSCWorkflowStore()
  const navigate = useNavigate()
  const [perspectives, setPerspectives] = useState(DEFAULT_PERSPECTIVES)

  const activeStrategy = strategySets.find(s => s.id === activeStrategyId) ?? strategySets[0]
  const activeObjectives = activeStrategy?.objectives ?? []

  const handleSave = (id, updated) => {
    setPerspectives((prev) => prev.map((p) => p.id === id ? { ...p, ...updated } : p))
  }

  const handleComplete = () => {
    markStepComplete('B4')
    navigate('/fishbone')
  }

  const getObjectivesForPerspective = (perspectiveId) =>
    activeObjectives.filter((o) => o.perspective === perspectiveId)

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thành phần BSC</h1>
          <p className="text-sm text-slate-500 mt-1">Cấu hình 4 góc độ BSC và các mục tiêu chiến lược</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/strategy-map/company')}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <Eye size={15} /> Xem Bản đồ
          </button>
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Hoàn thành B4 <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Strategy tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">Chiến lược:</span>
          {strategySets.map((s) => (
            <div key={s.id} className="flex items-center gap-0 shrink-0">
              <button
                onClick={() => setActiveStrategy(s.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-l-lg text-xs font-semibold transition-all"
                style={s.id === activeStrategyId
                  ? { background: s.color, color: '#fff', boxShadow: `0 2px 8px ${s.color}40` }
                  : { background: '#f1f5f9', color: '#64748b' }
                }
              >
                <span className="w-2 h-2 rounded-full" style={{ background: s.id === activeStrategyId ? '#fff' : s.color }} />
                {s.name}
                <span className="opacity-70">— {s.description}</span>
              </button>
              {strategySets.length > 1 && (
                <button
                  onClick={() => deleteStrategy(s.id)}
                  title="Xóa chiến lược"
                  className="px-1.5 py-1.5 rounded-r-lg text-xs transition-all hover:bg-red-100 hover:text-red-600"
                  style={s.id === activeStrategyId
                    ? { background: s.color, color: '#fff9' }
                    : { background: '#f1f5f9', color: '#cbd5e1' }
                  }
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addStrategy(`Chiến lược ${strategySets.length + 1}`, '', STRATEGY_COLORS[strategySets.length % STRATEGY_COLORS.length])}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0 ml-1"
          >
            <Plus size={13} /> Thêm chiến lược
          </button>
        </div>

        {/* BSC Framework overview */}
        <div className="p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Khung BSC — Mô hình 4 góc độ</h2>
          <div className="relative flex flex-col items-center gap-2">
            <div className="flex gap-4 w-full">
              {perspectives.map((p) => (
                <div key={p.id} className="flex-1 rounded-xl border-2 px-3 py-2.5 text-center" style={{ borderColor: p.color, background: `${p.color}0a` }}>
                  <div className="text-lg">{p.icon}</div>
                  <div className="text-xs font-bold mt-1" style={{ color: p.color }}>{p.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{getObjectivesForPerspective(p.id).length} mục tiêu</div>
                </div>
              ))}
            </div>
            <div className="w-0.5 h-6 bg-slate-300" />
            <div className="px-6 py-2 rounded-xl text-white text-xs font-bold" style={{ background: activeStrategy?.color ?? '#1e293b' }}>
              {activeStrategy?.name ?? 'TẦM NHÌN & CHIẾN LƯỢC'} — {activeStrategy?.description}
            </div>
          </div>
        </div>
      </div>

      {/* Perspective cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perspectives.map((p) => (
          <PerspectiveCard
            key={p.id}
            perspective={p}
            objectives={getObjectivesForPerspective(p.id)}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  )
}
