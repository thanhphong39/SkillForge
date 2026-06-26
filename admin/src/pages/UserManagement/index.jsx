import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Plus, Search, Users } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore.js'
import { toast } from '../../components/ui/toast.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

const ROLES = [
  { value: 'admin',   label: 'Quản trị',  color: 'red' },
  { value: 'manager', label: 'Quản lý',   color: 'blue' },
  { value: 'staff',   label: 'Nhân viên', color: 'slate' },
]

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#6366f1', '#14b8a6', '#f97316',
]

function getAvatarColor(id = '') {
  const hash = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function Avatar({ user, size = 'md' }) {
  const initials = getInitials(user.name)
  const bg = getAvatarColor(user.id)
  const cls = size === 'sm'
    ? 'w-8 h-8 text-xs'
    : 'w-10 h-10 text-sm'
  return (
    <div
      className={`${cls} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: bg }}
    >
      {initials || <Users size={12} />}
    </div>
  )
}

export default function UserManagementPage() {
  const { users, departments, addUser, updateUser, deleteUser, init } = useAdminStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterDept, setFilterDept] = useState('all')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { init() }, [])

  function openAdd() {
    setEditing(null)
    reset({ role: 'staff', deptId: '' })
    setOpen(true)
  }

  function openEdit(u) {
    setEditing(u)
    reset(u)
    setOpen(true)
  }

  async function onSubmit(data) {
    if (editing) {
      updateUser(editing.id, data)
      toast.success(`Đã cập nhật tài khoản "${data.name}"`)
    } else {
      await addUser(data)
      toast.success(`Đã thêm người dùng "${data.name}"`)
    }
    setOpen(false)
  }

  const getDeptName = (id) => departments.find((d) => d.id === id)?.name ?? '—'
  const getDeptColor = (id) => departments.find((d) => d.id === id)?.color
  const getRole = (role) => ROLES.find((r) => r.value === role)

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.title?.toLowerCase().includes(search.toLowerCase())
      const matchRole = filterRole === 'all' || u.role === filterRole
      const matchDept = filterDept === 'all' || u.deptId === filterDept
      return matchSearch && matchRole && matchDept
    })
  }, [users, search, filterRole, filterDept])

  const roleCounts = useMemo(() => {
    return users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1
      return acc
    }, {})
  }, [users])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Người dùng</h2>
          <p className="text-slate-500 text-sm mt-1">
            {users.length} tài khoản &middot;{' '}
            {ROLES.map((r) => `${roleCounts[r.value] ?? 0} ${r.label}`).join(' · ')}
          </p>
        </div>
        <Button onClick={openAdd} icon={<Plus size={16} />}>Thêm người dùng</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, chức danh..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Tất cả vai trò</option>
          {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Tất cả phòng ban</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <Card padding={false}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Người dùng</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Phòng ban</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Vai trò</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">
                  <Users size={28} className="mx-auto mb-2 text-slate-300" />
                  {search || filterRole !== 'all' || filterDept !== 'all'
                    ? 'Không tìm thấy người dùng phù hợp'
                    : 'Chưa có người dùng nào'
                  }
                </td>
              </tr>
            )}
            {filtered.map((u) => {
              const role = getRole(u.role)
              const deptColor = getDeptColor(u.deptId)
              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={u} size="sm" />
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{u.name}</div>
                        {u.title && <div className="text-xs text-slate-400">{u.title}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.deptId ? (
                      <div className="flex items-center gap-1.5">
                        {deptColor && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: deptColor }} />}
                        <span className="text-sm text-slate-600">{getDeptName(u.deptId)}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge color={role?.color ?? 'slate'}>{role?.label ?? u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Xóa tài khoản "${u.name}"?`)) { deleteUser(u.id); toast.success(`Đã xóa "${u.name}"`) } }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
            Hiển thị {filtered.length}/{users.length} người dùng
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Sửa người dùng' : 'Thêm người dùng'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editing ? 'Lưu thay đổi' : 'Thêm người dùng'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Họ tên *"
            placeholder="Nguyễn Văn A"
            {...register('name', { required: 'Bắt buộc' })}
            error={errors.name?.message}
          />
          <Input
            label="Email *"
            type="email"
            placeholder="email@company.vn"
            {...register('email', { required: 'Bắt buộc' })}
            error={errors.email?.message}
          />
          <Input
            label="Chức danh"
            placeholder="Trưởng phòng Kinh doanh"
            {...register('title')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Phòng ban" {...register('deptId')}>
              <option value="">-- Chưa phân công --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
            <Select label="Vai trò *" {...register('role', { required: true })}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>
          </div>
          {!editing && (
            <Input
              label="Mật khẩu mặc định"
              type="password"
              placeholder="Mặc định: 123456"
              {...register('password')}
            />
          )}
        </div>
      </Modal>
    </div>
  )
}

