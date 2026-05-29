import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, Edit3, Trash2, ChevronRight, X, Shield, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import clsx from 'clsx'
import { useSWOTStore } from '../../store/swotStore.js'

const QUADRANT_META = {
  strength:    { label: 'Điểm mạnh',    labelEn: 'Strengths',    icon: Shield,        color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  weakness:    { label: 'Điểm yếu',     labelEn: 'Weaknesses',   icon: AlertTriangle, color: 'red',     bg: 'bg-red-50',     border: 'border-red-200',     header: 'bg-red-600',     badge: 'bg-red-100 text-red-700' },
  opportunity: { label: 'Cơ hội',       labelEn: 'Opportunities', icon: TrendingUp,   color: 'blue',    bg: 'bg-blue-50',    border: 'border-blue-200',    header: 'bg-blue-600',    badge: 'bg-blue-100 text-blue-700' },
  threat:      { label: 'Thách thức',   labelEn: 'Threats',      icon: Zap,           color: 'amber',   bg: 'bg-amber-50',   border: 'border-amber-200',   header: 'bg-amber-600',   badge: 'bg-amber-100 text-amber-700' },
}

const IMPACT_META = {
  high:   { label: 'Cao',    cls: 'bg-rose-100 text-rose-700' },
  medium: { label: 'Vừa',   cls: 'bg-yellow-100 text-yellow-700' },
  low:    { label: 'Thấp',   cls: 'bg-slate-100 text-slate-500' },
}

const CATEGORIES = {
  strength:    ['brand', 'people', 'operations', 'finance', 'product', 'technology'],
  weakness:    ['technology', 'people', 'operations', 'product', 'finance', 'brand'],
  opportunity: ['market', 'expansion', 'product', 'technology', 'regulation', 'finance'],
  threat:      ['competition', 'supply', 'finance', 'regulation', 'market', 'technology'],
}

const CATEGORY_LABELS = {
  brand: 'Thương hiệu', people: 'Con người', operations: 'Vận hành', finance: 'Tài chính',
  product: 'Sản phẩm', technology: 'Công nghệ', market: 'Thị trường', expansion: 'Mở rộng',
  regulation: 'Pháp lý', competition: 'Cạnh tranh', supply: 'Chuỗi cung ứng',
}

function SwotItemCard({ item, onEdit, onDelete }) {
  const meta = QUADRANT_META[item.quadrant]
  return (
    <div className={`group relative rounded-xl border ${meta.border} ${meta.bg} p-3 transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${IMPACT_META[item.impact].cls}`}>
              {IMPACT_META[item.impact].label}
            </span>
            <span className="text-[10px] text-slate-400">{CATEGORY_LABELS[item.category] || item.category}</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-snug">{item.title}</p>
          <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">{item.description}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onEdit(item)} className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors">
            <Edit3 size={11} className="text-slate-500 hover:text-blue-600" />
          </button>
          <button onClick={() => onDelete(item.id)} className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors">
            <Trash2 size={11} className="text-slate-500 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

function SwotQuadrant({ quadrant, items, onAdd, onEdit, onDelete }) {
  const meta = QUADRANT_META[quadrant]
  const Icon = meta.icon
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className={`${meta.header} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <Icon size={16} />
          <span className="font-bold text-sm">{meta.label}</span>
          <span className="font-light text-xs opacity-70">/ {meta.labelEn}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{items.length}</span>
          <button
            onClick={() => onAdd(quadrant)}
            className="w-6 h-6 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <Plus size={13} className="text-white" />
          </button>
        </div>
      </div>
      <div className={`flex-1 ${meta.bg} p-3 space-y-2 min-h-48 max-h-96 overflow-y-auto`}>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <Icon size={28} className="opacity-20 mb-2" />
            <p className="text-xs">Chưa có mục nào</p>
            <button onClick={() => onAdd(quadrant)} className="mt-2 text-xs text-blue-500 hover:underline">+ Thêm mục</button>
          </div>
        ) : (
          items.map((item) => (
            <SwotItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}

function SwotModal({ open, onClose, onSave, editItem, defaultQuadrant }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: editItem ?? { quadrant: defaultQuadrant, title: '', description: '', impact: 'medium', category: 'brand' },
  })
  const quadrant = watch('quadrant')

  if (!open) return null

  const onSubmit = (data) => { onSave(data); reset(); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`${QUADRANT_META[quadrant]?.header ?? 'bg-slate-700'} px-5 py-4 flex items-center justify-between`}>
          <h3 className="text-white font-bold text-sm">{editItem ? 'Chỉnh sửa' : 'Thêm mục'} SWOT</h3>
          <button onClick={onClose}><X size={18} className="text-white/70 hover:text-white" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-sm">Loại</label>
              <select className="input-sm" {...register('quadrant', { required: true })}>
                {Object.entries(QUADRANT_META).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label-sm">Mức độ ảnh hưởng</label>
              <select className="input-sm" {...register('impact', { required: true })}>
                {Object.entries(IMPACT_META).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-sm">Danh mục</label>
            <select className="input-sm" {...register('category')}>
              {(CATEGORIES[quadrant] ?? []).map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="label-sm">Tiêu đề <span className="text-red-500">*</span></label>
            <input className={clsx('input-sm', errors.title && 'border-red-400')} placeholder="Mô tả ngắn gọn..." {...register('title', { required: true })} />
          </div>
          <div>
            <label className="label-sm">Mô tả chi tiết</label>
            <textarea className="input-sm resize-none" rows={3} placeholder="Bằng chứng, số liệu, ví dụ cụ thể..." {...register('description')} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
            <button type="submit" className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              {editItem ? 'Cập nhật' : 'Thêm mục'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .label-sm { display:block; font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.05em; margin-bottom:4px; }
        .input-sm { width:100%; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; font-size:13px; outline:none; transition:border-color .15s; background:white; }
        .input-sm:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
      `}</style>
    </div>
  )
}

export default function SwotPage() {
  const { items, addItem, updateItem, deleteItem } = useSWOTStore()
  const navigate = useNavigate()
  const [modal, setModal] = useState({ open: false, quadrant: 'strength', editItem: null })

  const openAdd = (quadrant) => setModal({ open: true, quadrant, editItem: null })
  const openEdit = (item) => setModal({ open: true, quadrant: item.quadrant, editItem: item })
  const closeModal = () => setModal((m) => ({ ...m, open: false }))

  const handleSave = (data) => {
    if (modal.editItem) { updateItem(modal.editItem.id, data) }
    else { addItem(data) }
  }

  const quadrants = ['strength', 'weakness', 'opportunity', 'threat']
  const countByQ = Object.fromEntries(quadrants.map((q) => [q, items.filter((i) => i.quadrant === q).length]))

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Phân tích SWOT</h1>
          <p className="text-sm text-slate-500 mt-1">Xác định điểm mạnh, điểm yếu, cơ hội và thách thức</p>
        </div>
        <button
          onClick={() => navigate('/strategy-build/formulate')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          Xây dựng Chiến lược
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-4 gap-3">
        {quadrants.map((q) => {
          const meta = QUADRANT_META[q]
          const Icon = meta.icon
          return (
            <div key={q} className={`rounded-xl border ${meta.border} ${meta.bg} px-4 py-3 flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-xl ${meta.header} flex items-center justify-center`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{countByQ[q]}</div>
                <div className="text-xs text-slate-500">{meta.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q) => (
          <SwotQuadrant
            key={q}
            quadrant={q}
            items={items.filter((i) => i.quadrant === q)}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={deleteItem}
          />
        ))}
      </div>

      <SwotModal
        open={modal.open}
        onClose={closeModal}
        onSave={handleSave}
        editItem={modal.editItem}
        defaultQuadrant={modal.quadrant}
      />
    </div>
  )
}
