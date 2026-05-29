import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore.js'
import { Card } from '../../components/ui/Card.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

const ROLE_COLORS = { admin: 'red', manager: 'blue', staff: 'slate' }
const ROLE_LABELS = { admin: 'Quản trị', manager: 'Quản lý', staff: 'Nhân viên' }

export default function UserManagementPage() {
  const { users, departments, addUser, updateUser, deleteUser } = useAdminStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function openAdd() { setEditing(null); reset({ role: 'staff' }); setOpen(true) }
  function openEdit(u) { setEditing(u); reset(u); setOpen(true) }
  function onSubmit(data) { editing ? updateUser(editing.id, data) : addUser(data); setOpen(false) }

  const getDeptName = id => departments.find(d => d.id === id)?.name ?? '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-slate-800">Quản lý Người dùng</h2><p className="text-slate-500 text-sm mt-1">{users.length} người dùng</p></div>
        <Button onClick={openAdd} icon={<Plus size={16} />}>Thêm người dùng</Button>
      </div>
      <Card padding={false}>
        <table className="w-full">
          <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Họ tên</th><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Email</th><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Phòng ban</th><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Vai trò</th><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3"><div className="font-medium text-slate-800 text-sm">{u.name}</div><div className="text-xs text-slate-400">{u.title}</div></td>
                <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{getDeptName(u.deptId)}</td>
                <td className="px-4 py-3 text-center"><Badge color={ROLE_COLORS[u.role] ?? 'slate'}>{ROLE_LABELS[u.role] ?? u.role}</Badge></td>
                <td className="px-4 py-3 text-right"><div className="flex gap-1 justify-end"><button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"><Pencil size={14} /></button><button onClick={() => confirm(`Xóa "${u.name}"?`) && deleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa người dùng' : 'Thêm người dùng'} footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button><Button onClick={handleSubmit(onSubmit)}>{editing ? 'Lưu' : 'Thêm'}</Button></>}>
        <div className="space-y-3">
          <Input label="Họ tên *" {...register('name', { required: true })} error={errors.name && 'Bắt buộc'} />
          <Input label="Email *" type="email" {...register('email', { required: true })} error={errors.email && 'Bắt buộc'} />
          <Input label="Chức danh" {...register('title')} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Phòng ban" {...register('deptId')}>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select label="Vai trò" {...register('role')}>
              <option value="admin">Quản trị</option>
              <option value="manager">Quản lý</option>
              <option value="staff">Nhân viên</option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
