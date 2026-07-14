import { useState, useEffect, useCallback } from 'react'
import {
  Building2, Users, LayoutGrid, UserPlus, Pencil, Trash2,
  Plus, Save, X, Eye, EyeOff, ChevronDown, RefreshCw,
  CheckCircle2, AlertCircle, Loader2, Shield, Phone, Mail,
  Hash, Palette, BadgeCheck, Ban,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore.js'
import companyService from '../../services/companyService.js'
import departmentService from '../../services/departmentService.js'
import employeeService from '../../services/employeeService.js'

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES = ['CEO', 'DEPARTMENT_HEAD', 'EMPLOYEE', 'COMPANY_ADMIN']
const ROLE_LABELS = {
  CEO: 'Giám đốc (CEO)',
  DEPARTMENT_HEAD: 'Trưởng phòng',
  EMPLOYEE: 'Nhân viên',
  COMPANY_ADMIN: 'Quản trị viên',
}
const DEPT_COLORS = [
  '#3C50E0', '#16a34a', '#dc2626', '#9333ea',
  '#d97706', '#0891b2', '#db2777', '#65a30d',
]

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function Alert({ type, message, onClose }) {
  if (!message) return null
  const ok = type === 'success'
  return (
    <div className={clsx(
      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border mb-4',
      ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
         : 'bg-red-50 text-red-700 border-red-200'
    )}>
      {ok ? <CheckCircle2 size={15} className="shrink-0" />
           : <AlertCircle  size={15} className="shrink-0" />}
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
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function FormField({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function Input({ id, value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <input
      id={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder} disabled={disabled}
      className={clsx(
        'w-full px-3.5 py-2.5 text-sm border rounded-xl transition-all focus:outline-none',
        disabled
          ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
          : 'border-slate-200 focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0]'
      )}
    />
  )
}

// ─── Tab: Company Info ────────────────────────────────────────────────────────
function CompanyTab({ companyId }) {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [form, setForm] = useState({ name: '', taxCode: '', industry: '', size: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await companyService.getById(companyId)
      setCompany(data)
      setForm({ name: data.name ?? '', taxCode: data.taxCode ?? '', industry: data.industry ?? '', size: data.size ?? '' })
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.name.trim()) return setFeedback({ type: 'error', message: 'Tên công ty không được để trống' })
    setSaving(true)
    setFeedback(null)
    try {
      await companyService.update(companyId, form)
      setFeedback({ type: 'success', message: 'Đã cập nhật thông tin công ty!' })
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#3C50E0]" /></div>

  return (
    <div className="max-w-2xl space-y-5">
      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <FormField label="Tên công ty" required>
            <Input id="ca-company-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Công ty TNHH ABC" />
          </FormField>
        </div>
        <FormField label="Mã số thuế">
          <Input id="ca-tax-code" value={form.taxCode} onChange={e => setForm(f => ({ ...f, taxCode: e.target.value }))} placeholder="0123456789" />
        </FormField>
        <FormField label="Ngành nghề">
          <Input id="ca-industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="Công nghệ thông tin" />
        </FormField>
        <FormField label="Quy mô">
          <select
            id="ca-size"
            value={form.size}
            onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all"
          >
            <option value="">Chọn quy mô</option>
            <option value="SMALL">Nhỏ (dưới 50 NV)</option>
            <option value="MEDIUM">Vừa (50–200 NV)</option>
            <option value="LARGE">Lớn (trên 200 NV)</option>
          </select>
        </FormField>
      </div>

      {company && (
        <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-1">
          <p>ID: <span className="font-mono text-slate-700">{company.id}</span></p>
          <p>Trạng thái: <span className={clsx('font-semibold', company.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-500')}>{company.status}</span></p>
        </div>
      )}

      <button
        id="ca-save-company"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] hover:bg-[#3142C4] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </div>
  )
}

// ─── Tab: Departments ─────────────────────────────────────────────────────────
function DepartmentsTab({ companyId }) {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', color: DEPT_COLORS[0], description: '' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await departmentService.listByCompany(companyId)
      setDepartments(data)
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [companyId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ name: '', code: '', color: DEPT_COLORS[0], description: '' })
    setEditTarget(null)
    setModal('create')
  }
  const openEdit = (dept) => {
    setForm({ name: dept.name, code: dept.code ?? '', color: dept.color ?? DEPT_COLORS[0], description: dept.description ?? '' })
    setEditTarget(dept)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) return setFeedback({ type: 'error', message: 'Tên và mã phòng ban là bắt buộc' })
    setSaving(true)
    setFeedback(null)
    try {
      if (modal === 'create') {
        await departmentService.create(companyId, form)
        setFeedback({ type: 'success', message: 'Đã tạo phòng ban!' })
      } else {
        await departmentService.update(editTarget.id, form)
        setFeedback({ type: 'success', message: 'Đã cập nhật phòng ban!' })
      }
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleDelete = async (dept) => {
    if (!window.confirm(`Xóa phòng ban "${dept.name}"?`)) return
    try {
      await departmentService.delete(dept.id)
      setFeedback({ type: 'success', message: 'Đã xóa phòng ban!' })
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          {departments.length} phòng ban
        </h3>
        <button
          id="ca-add-dept"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-colors shadow-sm"
        >
          <Plus size={15} /> Thêm phòng ban
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#3C50E0]" /></div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">Chưa có phòng ban nào</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                  style={{ background: dept.color ?? '#3C50E0' }}
                >
                  {(dept.name ?? '?')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1C2434] text-sm truncate">{dept.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{dept.code}</p>
                  {dept.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEdit(dept)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#3C50E0] transition-colors px-2 py-1 rounded-lg hover:bg-[#3C50E0]/5"
                >
                  <Pencil size={12} /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(dept)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={12} /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Thêm phòng ban' : 'Chỉnh sửa phòng ban'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FormField label="Tên phòng ban" required>
              <Input id="dept-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Phòng Kinh doanh" />
            </FormField>
            <FormField label="Mã phòng ban" required>
              <Input id="dept-code" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="KD" />
            </FormField>
            <FormField label="Màu sắc">
              <div className="flex gap-2 flex-wrap">
                {DEPT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={clsx('w-7 h-7 rounded-full transition-all', form.color === c && 'ring-2 ring-offset-2 ring-slate-400')}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </FormField>
            <FormField label="Mô tả">
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả chức năng của phòng ban..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all resize-none"
              />
            </FormField>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy</button>
              <button
                id="dept-save"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:opacity-60 transition-colors"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Tab: Employees ───────────────────────────────────────────────────────────
function EmployeesTab({ companyId }) {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | 'edit' | 'account'
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ departmentId: '', fullName: '', email: '', phone: '', positionTitle: '' })
  const [accountForm, setAccountForm] = useState({ email: '', password: '', role: 'EMPLOYEE' })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [filterDept, setFilterDept] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [emps, depts] = await Promise.all([
        employeeService.listByCompany(companyId),
        departmentService.listByCompany(companyId),
      ])
      setEmployees(emps)
      setDepartments(depts)
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [companyId])

  useEffect(() => { load() }, [load])

  const deptMap = Object.fromEntries(departments.map(d => [d.id, d]))
  const filtered = filterDept ? employees.filter(e => e.departmentId === filterDept) : employees

  const openCreate = () => {
    setForm({ departmentId: departments[0]?.id ?? '', fullName: '', email: '', phone: '', positionTitle: '' })
    setEditTarget(null)
    setModal('create')
  }
  const openEdit = (emp) => {
    setForm({ departmentId: emp.departmentId ?? '', fullName: emp.fullName ?? '', email: emp.email ?? '', phone: emp.phone ?? '', positionTitle: emp.positionTitle ?? '' })
    setEditTarget(emp)
    setModal('edit')
  }
  const openAccount = (emp) => {
    setAccountForm({ email: emp.email ?? '', password: '', role: 'EMPLOYEE' })
    setEditTarget(emp)
    setModal('account')
  }

  const handleSave = async () => {
    if (!form.fullName.trim()) return setFeedback({ type: 'error', message: 'Họ tên là bắt buộc' })
    if (!form.email.trim()) return setFeedback({ type: 'error', message: 'Email là bắt buộc' })
    if (!form.departmentId) return setFeedback({ type: 'error', message: 'Phòng ban là bắt buộc' })
    setSaving(true); setFeedback(null)
    try {
      if (modal === 'create') {
        await employeeService.create(companyId, form)
        setFeedback({ type: 'success', message: 'Đã thêm nhân viên!' })
      } else {
        await employeeService.update(editTarget.id, form)
        setFeedback({ type: 'success', message: 'Đã cập nhật nhân viên!' })
      }
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleDelete = async (emp) => {
    if (!window.confirm(`Xóa nhân viên "${emp.fullName}"?`)) return
    try {
      await employeeService.delete(emp.id)
      setFeedback({ type: 'success', message: 'Đã xóa nhân viên!' })
      await load()
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
  }

  const handleCreateAccount = async () => {
    if (!accountForm.email || !accountForm.password) return setFeedback({ type: 'error', message: 'Email và mật khẩu là bắt buộc' })
    setSaving(true); setFeedback(null)
    try {
      await employeeService.createAccount(editTarget.id, accountForm)
      setFeedback({ type: 'success', message: 'Đã tạo tài khoản đăng nhập!' })
      setModal(null)
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all"
        >
          <option value="">Tất cả phòng ban ({employees.length})</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({employees.filter(e => e.departmentId === d.id).length})</option>
          ))}
        </select>
        <button
          id="ca-add-employee"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-colors shadow-sm"
        >
          <UserPlus size={15} /> Thêm nhân viên
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#3C50E0]" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Nhân viên</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Phòng ban</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Chức danh</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden lg:table-cell">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400">Không có nhân viên</td></tr>
              ) : filtered.map(emp => {
                const dept = deptMap[emp.departmentId]
                const initials = (emp.fullName ?? '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: dept?.color ?? '#3C50E0' }}
                        >{initials}</div>
                        <div>
                          <p className="font-semibold text-[#1C2434]">{emp.fullName}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {dept ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: dept.color ?? '#3C50E0' }}>
                          {dept.name}
                        </span>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">{emp.positionTitle ?? '—'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={clsx(
                        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                        emp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      )}>
                        {emp.status === 'ACTIVE' ? <BadgeCheck size={10} /> : <Ban size={10} />}
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openAccount(emp)}
                          title="Tạo tài khoản đăng nhập"
                          className="p-1.5 text-slate-400 hover:text-[#3C50E0] hover:bg-[#3C50E0]/5 rounded-lg transition-colors"
                        ><Shield size={14} /></button>
                        <button
                          onClick={() => openEdit(emp)}
                          title="Chỉnh sửa"
                          className="p-1.5 text-slate-400 hover:text-[#3C50E0] hover:bg-[#3C50E0]/5 rounded-lg transition-colors"
                        ><Pencil size={14} /></button>
                        <button
                          onClick={() => handleDelete(emp)}
                          title="Xóa"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        ><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Employee Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân viên'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FormField label="Họ và tên" required>
              <Input id="emp-fullname" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Nguyễn Văn A" />
            </FormField>
            <FormField label="Email" required>
              <Input id="emp-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="nhanvien@company.vn" />
            </FormField>
            <FormField label="Phòng ban" required>
              <select
                value={form.departmentId}
                onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all"
              >
                <option value="">-- Chọn phòng ban --</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </FormField>
            <FormField label="Chức danh">
              <Input id="emp-title" value={form.positionTitle} onChange={e => setForm(f => ({ ...f, positionTitle: e.target.value }))} placeholder="Nhân viên kinh doanh" />
            </FormField>
            <FormField label="Số điện thoại">
              <Input id="emp-phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0901234567" />
            </FormField>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy</button>
              <button id="emp-save" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Account Modal */}
      {modal === 'account' && editTarget && (
        <Modal title={`Tạo tài khoản — ${editTarget.fullName}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
              <Shield size={15} className="shrink-0" />
              <span>Tạo tài khoản để nhân viên có thể đăng nhập vào hệ thống.</span>
            </div>
            <FormField label="Email đăng nhập" required>
              <Input id="acc-email" type="email" value={accountForm.email} onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))} placeholder="nhanvien@company.vn" />
            </FormField>
            <FormField label="Mật khẩu ban đầu" required>
              <div className="relative">
                <input
                  id="acc-password"
                  type={showPass ? 'text' : 'password'}
                  value={accountForm.password}
                  onChange={e => setAccountForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </FormField>
            <FormField label="Vai trò" required>
              <select
                id="acc-role"
                value={accountForm.role}
                onChange={e => setAccountForm(f => ({ ...f, role: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C50E0]/20 focus:border-[#3C50E0] transition-all"
              >
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </FormField>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy</button>
              <button id="acc-create" onClick={handleCreateAccount} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Shield size={13} />} {saving ? 'Đang tạo...' : 'Tạo tài khoản'}
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
  { id: 'company',     label: 'Thông tin Công ty', icon: Building2 },
  { id: 'departments', label: 'Phòng ban',          icon: LayoutGrid },
  { id: 'employees',   label: 'Nhân viên',          icon: Users },
]

export default function CompanyAdminPage() {
  const { user } = useAuthStore()
  const companyId = user?.companyId
  const [activeTab, setActiveTab] = useState('company')

  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Building2 size={40} className="mb-3" />
        <p className="text-sm">Không tìm thấy thông tin công ty</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C2434]">Quản trị Công ty</h1>
        <p className="text-sm text-slate-500 mt-0.5">Quản lý thông tin công ty, phòng ban và nhân sự</p>
      </div>

      {/* Card with tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`ca-tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap',
                activeTab === id
                  ? 'text-[#3C50E0] border-[#3C50E0] bg-[#3C50E0]/5'
                  : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
              )}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'company'     && <CompanyTab     companyId={companyId} />}
          {activeTab === 'departments' && <DepartmentsTab companyId={companyId} />}
          {activeTab === 'employees'   && <EmployeesTab   companyId={companyId} />}
        </div>
      </div>
    </div>
  )
}
