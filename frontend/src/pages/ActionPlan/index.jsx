import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Plus, Filter, CheckSquare, Square, ChevronDown, Trash2, X,
  Calendar, User, Building, TrendingUp, Flag, Clock, Save, MoreHorizontal,
} from 'lucide-react'
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useActionPlanStore } from '../../store/actionPlanStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'

const PERSPECTIVES = [
  { id: 'financial', label: 'Tài chính',             color: '#16a34a', bg: 'bg-emerald-100 text-emerald-700' },
  { id: 'customer',  label: 'Khách hàng',            color: '#2563eb', bg: 'bg-blue-100 text-blue-700' },
  { id: 'internal',  label: 'Quy trình nội bộ',      color: '#9333ea', bg: 'bg-purple-100 text-purple-700' },
  { id: 'learning',  label: 'Học hỏi & PT',          color: '#d97706', bg: 'bg-amber-100 text-amber-700' },
]

const STATUS_META = {
  not_started: { label: 'Chưa bắt đầu', cls: 'bg-slate-100 text-slate-600', kanbanCls: 'border-slate-300 bg-slate-50' },
  in_progress:  { label: 'Đang thực hiện', cls: 'bg-blue-100 text-blue-700', kanbanCls: 'border-blue-300 bg-blue-50' },
  completed:    { label: 'Hoàn thành',   cls: 'bg-emerald-100 text-emerald-700', kanbanCls: 'border-emerald-300 bg-emerald-50' },
  delayed:      { label: 'Chậm tiến độ', cls: 'bg-red-100 text-red-700', kanbanCls: 'border-red-300 bg-red-50' },
}

const PRIORITY_META = {
  high:   { label: 'Cao',   cls: 'text-rose-600', icon: '🔴' },
  medium: { label: 'Vừa',  cls: 'text-amber-500', icon: '🟡' },
  low:    { label: 'Thấp', cls: 'text-slate-400', icon: '🟢' },
}

const DEPARTMENTS = [
  { id: 'dept-bgd', label: 'Ban giám đốc' },
  { id: 'dept-kd',  label: 'Kinh doanh' },
  { id: 'dept-kt',  label: 'Kế toán' },
  { id: 'dept-nv',  label: 'Nhân sự' },
  { id: 'dept-sx',  label: 'Sản xuất' },
  { id: 'dept-it',  label: 'IT' },
]

const USERS = [
  { id: 'usr-001', name: 'Nguyễn Văn A', dept: 'dept-bgd' },
  { id: 'usr-002', name: 'Trần Thị B',   dept: 'dept-kd' },
  { id: 'usr-003', name: 'Lê Văn C',     dept: 'dept-nv' },
  { id: 'usr-004', name: 'Phạm Thị D',   dept: 'dept-kt' },
  { id: 'usr-005', name: 'Hoàng Văn E',  dept: 'dept-sx' },
  { id: 'usr-006', name: 'Vũ Thị F',     dept: 'dept-it' },
]

function getUser(id)  { return USERS.find((u) => u.id === id) }
function getDept(id)  { return DEPARTMENTS.find((d) => d.id === id) }
function getPerspective(id) { return PERSPECTIVES.find((p) => p.id === id) }

function ProgressBar({ value, color }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${value}%`, background: color ?? '#3b82f6' }} />
    </div>
  )
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.not_started
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
}

// ─── Action Form Modal ───────────────────────────────────────────────────────

function ActionModal({ open, onClose, onSave, editAction }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: editAction ?? {
      title: '', description: '', perspectiveId: 'financial', objectiveId: '',
      assignedTo: 'usr-001', deptId: 'dept-kd',
      startDate: '2024-01-01', dueDate: '2024-06-30',
      priority: 'medium', status: 'not_started', budget: '', completionPct: 0,
    },
  })

  if (!open) return null

  const onSubmit = (data) => {
    onSave({ ...data, completionPct: +data.completionPct, budget: +data.budget, milestones: editAction?.milestones ?? [] })
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{editAction ? 'Chỉnh sửa hành động' : 'Thêm hành động mới'}</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="label-xs">Tên hành động <span className="text-red-500">*</span></label>
            <input className="input-f" {...register('title', { required: true })} placeholder="Mô tả ngắn gọn hành động..." />
          </div>
          <div>
            <label className="label-xs">Mô tả chi tiết</label>
            <textarea className="input-f resize-none" rows={2} {...register('description')} placeholder="Chi tiết và kết quả mong muốn..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-xs">Góc độ BSC</label>
              <select className="input-f" {...register('perspectiveId')}>
                {PERSPECTIVES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label-xs">Ưu tiên</label>
              <select className="input-f" {...register('priority')}>
                <option value="high">Cao</option>
                <option value="medium">Vừa</option>
                <option value="low">Thấp</option>
              </select>
            </div>
            <div>
              <label className="label-xs">Phòng ban</label>
              <select className="input-f" {...register('deptId')}>
                {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label-xs">Người phụ trách</label>
              <select className="input-f" {...register('assignedTo')}>
                {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-xs">Ngày bắt đầu</label>
              <input type="date" className="input-f" {...register('startDate')} />
            </div>
            <div>
              <label className="label-xs">Ngày kết thúc</label>
              <input type="date" className="input-f" {...register('dueDate')} />
            </div>
            <div>
              <label className="label-xs">Ngân sách (triệu đồng)</label>
              <input type="number" className="input-f" {...register('budget')} placeholder="0" />
            </div>
            <div>
              <label className="label-xs">Tiến độ (%)</label>
              <input type="number" min={0} max={100} className="input-f" {...register('completionPct')} />
            </div>
          </div>
          <div>
            <label className="label-xs">Trạng thái</label>
            <select className="input-f" {...register('status')}>
              {Object.entries(STATUS_META).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">Hủy</button>
            <button type="submit" className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
              {editAction ? 'Cập nhật' : 'Thêm hành động'}
            </button>
          </div>
        </form>
        <style>{`
          .label-xs { display:block; font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.05em; margin-bottom:4px; }
          .input-f { width:100%; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; font-size:13px; outline:none; transition:border-color .15s; background:white; }
          .input-f:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
        `}</style>
      </div>
    </div>
  )
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────

function KanbanCard({ action, onStatusChange, onEdit, onDelete }) {
  const p = getPerspective(action.perspectiveId)
  const user = getUser(action.assignedTo)
  const pMeta = PRIORITY_META[action.priority]

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="h-1 w-full" style={{ background: p?.color ?? '#64748b' }} />
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs" title={pMeta.label}>{pMeta.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">{action.title}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => onEdit(action)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-100"><MoreHorizontal size={11} className="text-slate-400" /></button>
            <button onClick={() => onDelete(action.id)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50"><Trash2 size={11} className="text-red-400" /></button>
          </div>
        </div>

        <div className="mb-2">
          <ProgressBar value={action.completionPct} color={p?.color} />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>{action.completionPct}%</span>
            <span className={p?.bg + ' px-1 rounded text-[9px]'}>{p?.label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><User size={9} /> {user?.name?.split(' ').slice(-1)[0]}</span>
          <span className="flex items-center gap-1"><Calendar size={9} /> {action.dueDate}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Gantt Bar ────────────────────────────────────────────────────────────────

function GanttView({ actions }) {
  const chartData = actions.slice(0, 10).map((a) => ({
    name: a.title.substring(0, 25) + (a.title.length > 25 ? '…' : ''),
    start: new Date(a.startDate).getMonth() + 1,
    duration: Math.max(1,
      (new Date(a.dueDate) - new Date(a.startDate)) / (1000 * 60 * 60 * 24 * 30)
    ),
    color: getPerspective(a.perspectiveId)?.color ?? '#64748b',
    status: a.status,
  }))

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Calendar size={15} className="text-blue-600" /> Timeline Hành động (tháng bắt đầu)
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" domain={[1, 12]} tickCount={12} tick={{ fontSize: 10, fill: '#94a3b8' }} label={{ value: 'Tháng', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }} />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip formatter={(v, name) => [name === 'start' ? `Tháng ${v}` : `${v.toFixed(1)} tháng`, name === 'start' ? 'Bắt đầu' : 'Thời gian']} />
            <Bar dataKey="start" fill="transparent" stackId="a" />
            <Bar dataKey="duration" radius={[0, 4, 4, 0]} stackId="a">
              {chartData.map((d, i) => <Cell key={i} fill={d.color} opacity={d.status === 'completed' ? 1 : 0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const KANBAN_COLUMNS = [
  { status: 'not_started', label: 'Chưa bắt đầu', color: 'bg-slate-400' },
  { status: 'in_progress', label: 'Đang thực hiện', color: 'bg-blue-500' },
  { status: 'completed',   label: 'Hoàn thành',   color: 'bg-emerald-500' },
  { status: 'delayed',     label: 'Chậm tiến độ', color: 'bg-red-500' },
]

export default function ActionPlanPage() {
  const { actions, addAction, updateAction, deleteAction, setStatus } = useActionPlanStore()
  const { markStepComplete } = useBSCWorkflowStore()
  const [tab, setTab] = useState('list')
  const [modal, setModal] = useState({ open: false, editAction: null })
  const [filterPerspective, setFilterPerspective] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dragId, setDragId] = useState(null)

  const filtered = actions.filter((a) => {
    if (filterPerspective !== 'all' && a.perspectiveId !== filterPerspective) return false
    if (filterStatus !== 'all' && a.status !== filterStatus) return false
    return true
  })

  const handleSave = (data) => {
    if (modal.editAction) { updateAction(modal.editAction.id, data) }
    else { addAction(data) }
  }

  const handleDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move' }
  const handleDrop = (e, status) => {
    e.preventDefault()
    if (dragId) { setStatus(dragId, status); setDragId(null) }
  }
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  const stats = {
    total: actions.length,
    completed: actions.filter((a) => a.status === 'completed').length,
    inProgress: actions.filter((a) => a.status === 'in_progress').length,
    delayed: actions.filter((a) => a.status === 'delayed').length,
    totalBudget: actions.reduce((s, a) => s + (a.budget || 0), 0),
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Action Plan</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các hành động triển khai chiến lược</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { markStepComplete('B8'); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-colors"
          >
            <Save size={14} /> Hoàn thành B8
          </button>
          <button
            onClick={() => setModal({ open: true, editAction: null })}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} /> Thêm hành động
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Tổng hành động',  value: stats.total,         color: 'text-slate-800' },
          { label: 'Hoàn thành',      value: stats.completed,     color: 'text-emerald-600' },
          { label: 'Đang thực hiện',  value: stats.inProgress,    color: 'text-blue-600' },
          { label: 'Chậm tiến độ',   value: stats.delayed,       color: 'text-red-600' },
          { label: 'Ngân sách (tr.)', value: stats.totalBudget,   color: 'text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {[['list', '☰ Danh sách'], ['kanban', '⬜ Kanban'], ['gantt', '📅 Gantt']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-5 py-3.5 text-sm font-semibold transition-colors border-b-2',
                tab === t ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {tab !== 'gantt' && (
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white text-slate-600"
              value={filterPerspective} onChange={(e) => setFilterPerspective(e.target.value)}>
              <option value="all">Tất cả góc độ</option>
              {PERSPECTIVES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white text-slate-600"
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(STATUS_META).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
            </select>
            <span className="text-xs text-slate-400 ml-auto">{filtered.length} hành động</span>
          </div>
        )}

        {/* LIST VIEW */}
        {tab === 'list' && (
          <div className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Flag size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Chưa có hành động nào</p>
                <button onClick={() => setModal({ open: true, editAction: null })} className="mt-3 text-sm text-blue-600 hover:underline">+ Thêm ngay</button>
              </div>
            ) : (
              filtered.map((action) => {
                const p = getPerspective(action.perspectiveId)
                const user = getUser(action.assignedTo)
                const dept = getDept(action.deptId)
                const pMeta = PRIORITY_META[action.priority]
                return (
                  <div key={action.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors group">
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: p?.color ?? '#64748b' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs" title={pMeta.label}>{pMeta.icon}</span>
                        <h3 className="text-sm font-semibold text-slate-800">{action.title}</h3>
                        <StatusBadge status={action.status} />
                        {p && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${p.bg}`}>{p.label}</span>}
                      </div>
                      {action.description && <p className="text-xs text-slate-500 mb-2 line-clamp-1">{action.description}</p>}
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1"><User size={10} /> {user?.name}</span>
                        <span className="flex items-center gap-1"><Building size={10} /> {dept?.label}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {action.startDate} → {action.dueDate}</span>
                        {action.budget > 0 && <span className="flex items-center gap-1"><TrendingUp size={10} /> {action.budget} tr.đ</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <ProgressBar value={action.completionPct} color={p?.color} />
                        <span className="text-[11px] text-slate-500 shrink-0">{action.completionPct}%</span>
                      </div>
                      {action.milestones?.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {action.milestones.map((m) => (
                            <span key={m.id} className={clsx('text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1',
                              m.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                            )}>
                              {m.done ? '✓' : '○'} {m.title.substring(0, 20)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => setModal({ open: true, editAction: action })} className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg">Sửa</button>
                      <button onClick={() => deleteAction(action.id)} className="text-xs text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-lg">Xóa</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* KANBAN VIEW */}
        {tab === 'kanban' && (
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {KANBAN_COLUMNS.map(({ status, label, color }) => {
                const colActions = filtered.filter((a) => a.status === status)
                return (
                  <div
                    key={status}
                    className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden min-h-64"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-200">
                      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-xs font-semibold text-slate-700">{label}</span>
                      <span className="ml-auto text-xs font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-full border border-slate-200">{colActions.length}</span>
                    </div>
                    <div className="p-2 space-y-2">
                      {colActions.map((action) => (
                        <div
                          key={action.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, action.id)}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <KanbanCard
                            action={action}
                            onStatusChange={setStatus}
                            onEdit={(a) => setModal({ open: true, editAction: a })}
                            onDelete={deleteAction}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* GANTT VIEW */}
        {tab === 'gantt' && (
          <div className="p-5">
            <GanttView actions={actions} />
          </div>
        )}
      </div>

      <ActionModal
        open={modal.open}
        onClose={() => setModal({ open: false, editAction: null })}
        onSave={handleSave}
        editAction={modal.editAction}
      />
    </div>
  )
}
