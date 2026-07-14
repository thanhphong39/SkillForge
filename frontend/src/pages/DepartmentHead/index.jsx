import { useEffect, useState, useCallback } from 'react'
import {
  RefreshCw, Loader2, AlertCircle, Target, Rocket,
  BarChart3, TrendingUp, Users, CheckCircle2, Clock,
  Flag, AlertTriangle, Plus, Pencil, Trash2, Save, X,
  ChevronRight, Play, PauseCircle, Eye, Ban, XCircle,
  FileText, ThumbsUp, ThumbsDown,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import api from '../../services/api.js'

// ─── Constants ────────────────────────────────────────────────────────────────
const ACHIEVEMENT_META = {
  ON_TRACK:     { label: 'Đúng tiến độ',  color: '#16a34a', bg: '#f0fdf4' },
  AT_RISK:      { label: 'Có rủi ro',     color: '#d97706', bg: '#fffbeb' },
  OFF_TRACK:    { label: 'Chậm tiến độ',  color: '#dc2626', bg: '#fef2f2' },
  NOT_STARTED:  { label: 'Chưa bắt đầu', color: '#64748b', bg: '#f8fafc' },
  ACHIEVED:     { label: 'Đạt mục tiêu',  color: '#059669', bg: '#ecfdf5' },
}
const STATUS_META = {
  TODO:        { label: 'Chờ thực hiện',   color: '#64748b', bg: '#f8fafc' },
  IN_PROGRESS: { label: 'Đang thực hiện',  color: '#3C50E0', bg: '#eef2ff' },
  REVIEW:      { label: 'Đang kiểm tra',   color: '#d97706', bg: '#fffbeb' },
  DONE:        { label: 'Hoàn thành',       color: '#16a34a', bg: '#f0fdf4' },
  BLOCKED:     { label: 'Bị chặn',          color: '#dc2626', bg: '#fef2f2' },
  CANCELLED:   { label: 'Đã hủy',           color: '#94a3b8', bg: '#f1f5f9' },
}
const KPI_REPORT_STATUS = {
  DRAFT:     { label: 'Nháp',      color: '#64748b' },
  SUBMITTED: { label: 'Đã nộp',    color: '#3C50E0' },
  APPROVED:  { label: 'Đã duyệt',  color: '#16a34a' },
  REJECTED:  { label: 'Từ chối',   color: '#dc2626' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Alert({ type, message, onClose }) {
  if (!message) return null
  const ok = type === 'success'
  return (
    <div className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border mb-4',
      ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
    )}>
      {ok ? <CheckCircle2 size={15} className="shrink-0" /> : <AlertCircle size={15} className="shrink-0" />}
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose}><X size={14} /></button>}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#1C2434]">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Summary Cards ────────────────────────────────────────────────────────────
function SummaryCards({ actionPlans, tasks, kpiReports }) {
  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'DONE').length
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length
  const totalReports = kpiReports.length
  const pendingReports = kpiReports.filter(r => r.status === 'SUBMITTED').length

  const cards = [
    { label: 'Action Plans',    value: actionPlans.length, icon: Rocket, color: '#3C50E0' },
    { label: 'Tổng Task',       value: totalTasks,          icon: Flag,   color: '#9333ea' },
    { label: 'Task Hoàn thành', value: doneTasks,            icon: CheckCircle2, color: '#16a34a',
      sub: totalTasks > 0 ? `${Math.round(doneTasks/totalTasks*100)}%` : '0%' },
    { label: 'Task Bị chặn',    value: blockedTasks,         icon: AlertTriangle, color: '#dc2626' },
    { label: 'Báo cáo KPI',     value: totalReports,         icon: BarChart3, color: '#d97706' },
    { label: 'Chờ phê duyệt',   value: pendingReports,       icon: Clock,  color: '#0891b2' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map(({ label, value, icon: Icon, color, sub }) => (
        <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
              <Icon size={17} style={{ color }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1C2434] mb-0.5">{value}</p>
          <p className="text-xs text-slate-500 leading-tight">{label}</p>
          {sub && <p className="text-xs font-bold mt-0.5" style={{ color }}>{sub}</p>}
        </div>
      ))}
    </div>
  )
}

// ─── Action Plans section ─────────────────────────────────────────────────────
function ActionPlansSection({ strategyId, departmentId, employees }) {
  const [actionPlans, setActionPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', ownerEmployeeId: '', priority: 'MEDIUM' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  // We need measured KPIs to create action plans, fetch them first
  const [measuredKpis, setMeasuredKpis] = useState([])
  const [selectedKpiId, setSelectedKpiId] = useState('')

  const load = useCallback(async () => {
    if (!strategyId) return
    setLoading(true)
    try {
      const [aps, measurements] = await Promise.all([
        api.get(`/bsc-strategies/${strategyId}/action-plans`),
        api.get(`/bsc-strategies/${strategyId}/measurements`),
      ])
      // Filter by department
      const deptAps = Array.isArray(aps)
        ? aps.filter(a => !departmentId || a.departmentId === departmentId)
        : []
      setActionPlans(deptAps)
      setMeasuredKpis(Array.isArray(measurements) ? measurements : [])
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [strategyId, departmentId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ name: '', description: '', startDate: '', endDate: '', ownerEmployeeId: employees[0]?.id ?? '' })
    setSelectedKpiId(measuredKpis[0]?.departmentKpiId ?? '')
    setEditTarget(null)
    setModal('create')
  }
  const openEdit = (ap) => {
    setForm({ name: ap.name ?? '', description: ap.description ?? '', startDate: ap.startDate?.split('T')[0] ?? '', endDate: ap.endDate?.split('T')[0] ?? '', ownerEmployeeId: ap.ownerEmployeeId ?? '' })
    setEditTarget(ap)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name.trim()) return setFeedback({ type: 'error', message: 'Tên action plan là bắt buộc' })
    setSaving(true); setFeedback(null)
    try {
      if (modal === 'create') {
        if (!selectedKpiId) return setFeedback({ type: 'error', message: 'Chọn KPI liên quan' })
        await api.post('/action-plans', {
          bscStrategyId: strategyId,
          departmentKpiId: selectedKpiId,
          name: form.name,
          description: form.description || null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          ownerId: form.ownerEmployeeId || null,
          priority: form.priority || 'MEDIUM',
          status: 'ACTIVE',
        })
        setFeedback({ type: 'success', message: 'Đã tạo Action Plan!' })
      } else {
        await api.put(`/action-plans/${editTarget.id}`, {
          name: form.name,
          description: form.description || null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          ownerEmployeeId: form.ownerEmployeeId || null,
        })
        setFeedback({ type: 'success', message: 'Đã cập nhật Action Plan!' })
      }
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1C2434] flex items-center gap-2">
          <Rocket size={17} className="text-[#3C50E0]" /> Action Plans
          <span className="text-sm font-normal text-slate-400">({actionPlans.length})</span>
        </h2>
        <button
          id="dh-add-ap"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-colors shadow-sm"
        >
          <Plus size={14} /> Thêm
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-[#3C50E0]" /></div>
      ) : actionPlans.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
          Chưa có Action Plan
        </div>
      ) : (
        <div className="space-y-3">
          {actionPlans.map(ap => {
            const apStatus = ap.status ?? 'ACTIVE'
            return (
              <div key={ap.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#1C2434] text-sm truncate">{ap.name}</p>
                      <span className={clsx('text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0',
                        apStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      )}>{apStatus}</span>
                    </div>
                    {ap.description && <p className="text-xs text-slate-500 line-clamp-2">{ap.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      {ap.startDate && <span>Từ: {new Date(ap.startDate).toLocaleDateString('vi-VN')}</span>}
                      {ap.endDate   && <span>Đến: {new Date(ap.endDate).toLocaleDateString('vi-VN')}</span>}
                      {ap.kpiName   && <span className="text-[#3C50E0]">KPI: {ap.kpiName}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit(ap)}
                    className="p-1.5 text-slate-400 hover:text-[#3C50E0] hover:bg-[#3C50E0]/5 rounded-lg transition-colors shrink-0"
                  ><Pencil size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Tạo Action Plan' : 'Chỉnh sửa Action Plan'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            {modal === 'create' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">KPI liên quan <span className="text-red-500">*</span></label>
                <select value={selectedKpiId} onChange={e => setSelectedKpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                  <option value="">-- Chọn KPI --</option>
                  {measuredKpis.map(m => <option key={m.departmentKpiId} value={m.departmentKpiId}>{m.kpiName}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tên Action Plan <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tên kế hoạch hành động"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mô tả</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày bắt đầu</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày kết thúc</label>
                <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Người phụ trách</label>
              <select value={form.ownerEmployeeId} onChange={e => setForm(f => ({ ...f, ownerEmployeeId: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Độ ưu tiên</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
                <option value="CRITICAL">Khẩn cấp</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy</button>
              <button id="ap-save" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── KPI Reports section ──────────────────────────────────────────────────────
function KpiReportsSection({ strategyId, departmentId }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ departmentKpiId: '', actualValue: '', reportingPeriod: '', notes: '', status: 'SUBMITTED' })
  const [measuredKpis, setMeasuredKpis] = useState([])
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!strategyId) return
    setLoading(true)
    try {
      const [reps, meas] = await Promise.all([
        api.get(`/bsc-strategies/${strategyId}/kpi-reports`),
        api.get(`/bsc-strategies/${strategyId}/measurements`),
      ])
      const filteredReps = Array.isArray(reps)
        ? reps.filter(r => !departmentId || r.departmentId === departmentId)
        : []
      setReports(filteredReps)
      setMeasuredKpis(Array.isArray(meas) ? meas : [])
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [strategyId, departmentId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ departmentKpiId: measuredKpis[0]?.departmentKpiId ?? '', actualValue: '', reportingPeriod: '', notes: '', status: 'SUBMITTED' })
    setModal('create')
  }

  const handleSave = async () => {
    if (!form.departmentKpiId || !form.actualValue || !form.reportingPeriod)
      return setFeedback({ type: 'error', message: 'KPI, Giá trị thực tế và Kỳ báo cáo là bắt buộc' })
    setSaving(true); setFeedback(null)
    try {
      await api.post('/kpi-reports', {
        departmentKpiId: form.departmentKpiId,
        actualValue: parseFloat(form.actualValue),
        reportingPeriod: form.reportingPeriod,
        note: form.notes || null,
        reviewStatus: form.status,
      })
      setFeedback({ type: 'success', message: 'Đã nộp báo cáo KPI!' })
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleReview = async (reportId, approved) => {
    try {
      await api.patch(`/kpi-reports/${reportId}/review`, { reviewStatus: approved ? 'APPROVED' : 'REJECTED' })
      setFeedback({ type: 'success', message: approved ? 'Đã phê duyệt!' : 'Đã từ chối!' })
      await load()
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1C2434] flex items-center gap-2">
          <BarChart3 size={17} className="text-[#3C50E0]" /> Báo cáo KPI
          <span className="text-sm font-normal text-slate-400">({reports.length})</span>
        </h2>
        <button id="dh-add-report" onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-colors shadow-sm">
          <Plus size={14} /> Nộp báo cáo
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-[#3C50E0]" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">KPI</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Kỳ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Thực tế</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Đạt được</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">Chưa có báo cáo KPI</td></tr>
              ) : reports.map(r => {
                const statusMeta = KPI_REPORT_STATUS[r.status] ?? KPI_REPORT_STATUS.SUBMITTED
                const achieveMeta = ACHIEVEMENT_META[r.achievementStatus] ?? ACHIEVEMENT_META.NOT_STARTED
                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#1C2434] max-w-[180px] truncate">{r.kpiName ?? r.departmentKpiId}</td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{r.reportingPeriod}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#1C2434]">
                      {r.actualValue}
                      {r.completionRate != null && (
                        <span className="ml-1 text-xs font-normal text-slate-400">({r.completionRate?.toFixed(1)}%)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: achieveMeta.bg, color: achieveMeta.color }}>
                        {achieveMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold" style={{ color: statusMeta.color }}>{statusMeta.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {r.status === 'SUBMITTED' && (
                          <>
                            <button onClick={() => handleReview(r.id, true)} title="Phê duyệt"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <ThumbsUp size={13} />
                            </button>
                            <button onClick={() => handleReview(r.id, false)} title="Từ chối"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <ThumbsDown size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Nộp Báo cáo KPI" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">KPI <span className="text-red-500">*</span></label>
              <select value={form.departmentKpiId} onChange={e => setForm(f => ({ ...f, departmentKpiId: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                <option value="">-- Chọn KPI --</option>
                {measuredKpis.map(m => <option key={m.departmentKpiId} value={m.departmentKpiId}>{m.kpiName}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Giá trị thực tế <span className="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" value={form.actualValue} onChange={e => setForm(f => ({ ...f, actualValue: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kỳ báo cáo <span className="text-red-500">*</span></label>
                <input value={form.reportingPeriod} onChange={e => setForm(f => ({ ...f, reportingPeriod: e.target.value }))}
                  placeholder="Q1-2026, Tháng 7/2026..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Trạng thái</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                <option value="DRAFT">Nháp</option>
                <option value="SUBMITTED">Nộp ngay</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ghi chú</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy</button>
              <button id="report-save" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />} {saving ? 'Đang nộp...' : 'Nộp báo cáo'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Tasks Section ────────────────────────────────────────────────────────────
function TasksSection({ strategyId, departmentId, actionPlans, employees }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ actionPlanId: '', name: '', description: '', assigneeId: '', startDate: '', dueDate: '', priority: 'MEDIUM' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const load = useCallback(async () => {
    if (!strategyId) return
    setLoading(true)
    try {
      const data = await api.get(`/bsc-strategies/${strategyId}/tasks/kanban`)
      // Flatten all columns
      const all = Object.values(data).flat()
      const filtered = departmentId ? all.filter(t => t.departmentId === departmentId) : all
      setTasks(filtered)
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [strategyId, departmentId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ actionPlanId: actionPlans[0]?.id ?? '', name: '', description: '', assigneeId: employees[0]?.id ?? '', startDate: '', dueDate: '', priority: 'MEDIUM' })
    setModal('create')
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.actionPlanId) return setFeedback({ type: 'error', message: 'Tên task và Action Plan là bắt buộc' })
    if (!form.assigneeId) return setFeedback({ type: 'error', message: 'Người được giao là bắt buộc' })
    if (!form.dueDate) return setFeedback({ type: 'error', message: 'Ngày kết thúc là bắt buộc' })
    setSaving(true); setFeedback(null)
    try {
      await api.post('/tasks', {
        actionPlanId: form.actionPlanId,
        name: form.name,
        description: form.description || null,
        assigneeId: form.assigneeId,
        startDate: form.startDate || null,
        dueDate: form.dueDate,
        priority: form.priority,
      })
      setFeedback({ type: 'success', message: 'Đã tạo task!' })
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { newStatus })
      setFeedback({ type: 'success', message: 'Đã cập nhật trạng thái!' })
      await load()
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
  }

  const statusGroups = STATUS_META
  const grouped = Object.keys(statusGroups).map(s => ({
    status: s,
    meta: statusGroups[s],
    tasks: tasks.filter(t => t.status === s),
  })).filter(g => g.tasks.length > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1C2434] flex items-center gap-2">
          <Flag size={17} className="text-[#3C50E0]" /> Tasks
          <span className="text-sm font-normal text-slate-400">({tasks.length})</span>
        </h2>
        <button id="dh-add-task" onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-colors shadow-sm">
          <Plus size={14} /> Thêm task
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-[#3C50E0]" /></div>
      ) : grouped.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">Chưa có task</div>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ status, meta, tasks: groupTasks }) => (
            <div key={status}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: meta.color }}>{meta.label}</span>
                <span className="text-xs text-slate-400">{groupTasks.length} task</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {groupTasks.map(task => (
                  <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-3.5 hover:shadow-md transition-shadow">
                    <p className="font-semibold text-sm text-[#1C2434] mb-1.5">{task.name}</p>
                    {task.assigneeName && <p className="text-xs text-slate-400 mb-2 flex items-center gap-1"><Users size={10} />{task.assigneeName}</p>}
                    {['TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED'].includes(status) && (() => {
                      const NEXT_MAP = { TODO: ['IN_PROGRESS'], IN_PROGRESS: ['REVIEW', 'BLOCKED'], REVIEW: ['DONE', 'IN_PROGRESS'], BLOCKED: ['IN_PROGRESS', 'CANCELLED'] }
                      const nexts = NEXT_MAP[status] ?? []
                      return nexts.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {nexts.map(ns => (
                            <button key={ns} onClick={() => handleStatusChange(task.id, ns)}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors"
                              style={{ borderColor: STATUS_META[ns]?.color, color: STATUS_META[ns]?.color }}>
                              → {STATUS_META[ns]?.label}
                            </button>
                          ))}
                        </div>
                      ) : null
                    })()}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Tạo Task" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Action Plan <span className="text-red-500">*</span></label>
              <select value={form.actionPlanId} onChange={e => setForm(f => ({ ...f, actionPlanId: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                <option value="">-- Chọn Action Plan --</option>
                {actionPlans.map(ap => <option key={ap.id} value={ap.id}>{ap.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tên Task <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tên công việc"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Giao cho <span className="text-red-500">*</span></label>
              <select value={form.assigneeId} onChange={e => setForm(f => ({ ...f, assigneeId: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Độ ưu tiên</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all">
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
                <option value="CRITICAL">Khẩn cấp</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày bắt đầu</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày kết thúc <span className="text-red-500">*</span></label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy</button>
              <button id="task-save" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} {saving ? 'Đang lưu...' : 'Tạo task'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',     label: 'Tổng quan',      icon: BarChart3 },
  { id: 'action-plans', label: 'Action Plans',   icon: Rocket },
  { id: 'tasks',        label: 'Tasks',           icon: Flag },
  { id: 'kpi-reports',  label: 'Báo cáo KPI',    icon: FileText },
]

export default function DepartmentHeadPage() {
  const { user } = useAuthStore()
  const { strategyId } = useBscContextStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [overviewData, setOverviewData] = useState(null)
  const [employees, setEmployees] = useState([])
  const [actionPlans, setActionPlans] = useState([])
  const [error, setError] = useState(null)

  const departmentId = user?.departmentId
  const companyId = user?.companyId

  const loadOverview = useCallback(async () => {
    if (!strategyId) return
    setLoading(true); setError(null)
    try {
      const [ap, kanban, reports, emps] = await Promise.all([
        api.get(`/bsc-strategies/${strategyId}/action-plans`),
        api.get(`/bsc-strategies/${strategyId}/tasks/kanban`),
        api.get(`/bsc-strategies/${strategyId}/kpi-reports`),
        companyId ? api.get(`/companies/${companyId}/employees`, { params: { departmentId } }).catch(() => []) : Promise.resolve([]),
      ])
      const allTasks = Object.values(kanban).flat()
      const deptAps = Array.isArray(ap) ? ap.filter(a => !departmentId || a.departmentId === departmentId) : []
      const deptReps = Array.isArray(reports) ? reports.filter(r => !departmentId || r.departmentId === departmentId) : []
      const deptTasks = Array.isArray(allTasks) ? allTasks.filter(t => !departmentId || t.departmentId === departmentId) : allTasks
      setOverviewData({ actionPlans: deptAps, tasks: deptTasks, kpiReports: deptReps })
      setActionPlans(deptAps)
      setEmployees(Array.isArray(emps) ? emps : [])
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }, [strategyId, departmentId, companyId])

  useEffect(() => { loadOverview() }, [loadOverview])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2434]">Trưởng phòng</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.fullName ?? 'Trưởng phòng'} — Phòng {user?.departmentName ?? 'của bạn'}
          </p>
        </div>
        <button onClick={loadOverview} disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Làm mới
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={15} className="shrink-0" />{error}
        </div>
      )}

      {/* Summary cards always visible */}
      {overviewData && (
        <SummaryCards
          actionPlans={overviewData.actionPlans}
          tasks={overviewData.tasks}
          kpiReports={overviewData.kpiReports}
        />
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} id={`dh-tab-${id}`} onClick={() => setActiveTab(id)}
              className={clsx('flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap',
                activeTab === id ? 'text-[#3C50E0] border-[#3C50E0] bg-[#3C50E0]/5' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
              )}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'overview' && overviewData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-sm text-[#1C2434] mb-3 flex items-center gap-2"><Rocket size={14} className="text-[#3C50E0]" />Action Plans gần đây</h3>
                  {overviewData.actionPlans.slice(0, 3).map(ap => (
                    <div key={ap.id} className="flex items-center gap-2 py-2 border-b border-slate-200 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-[#3C50E0] shrink-0" />
                      <span className="text-sm text-slate-700 flex-1 truncate">{ap.name}</span>
                    </div>
                  ))}
                  {overviewData.actionPlans.length === 0 && <p className="text-xs text-slate-400">Chưa có Action Plan</p>}
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-sm text-[#1C2434] mb-3 flex items-center gap-2"><BarChart3 size={14} className="text-[#3C50E0]" />Báo cáo KPI mới nhất</h3>
                  {overviewData.kpiReports.slice(0, 4).map(r => {
                    const sm = KPI_REPORT_STATUS[r.status]
                    return (
                      <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-sm text-slate-700 truncate max-w-[160px]">{r.kpiName ?? r.departmentKpiId}</span>
                        <span className="text-xs font-bold" style={{ color: sm?.color }}>{sm?.label}</span>
                      </div>
                    )
                  })}
                  {overviewData.kpiReports.length === 0 && <p className="text-xs text-slate-400">Chưa có báo cáo</p>}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'action-plans' && (
            <ActionPlansSection strategyId={strategyId} departmentId={departmentId} employees={employees} />
          )}
          {activeTab === 'tasks' && (
            <TasksSection strategyId={strategyId} departmentId={departmentId} actionPlans={actionPlans} employees={employees} />
          )}
          {activeTab === 'kpi-reports' && (
            <KpiReportsSection strategyId={strategyId} departmentId={departmentId} />
          )}
        </div>
      </div>
    </div>
  )
}
