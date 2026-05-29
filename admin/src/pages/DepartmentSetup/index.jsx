import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

export default function DepartmentSetupPage() {
  const { departments, users, addDept, updateDept, deleteDept } = useAdminStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  function openAdd() { setEditing(null); reset({ name: '', code: '', color: '#3b82f6' }); setOpen(true) }
  function openEdit(dept) { setEditing(dept); reset(dept); setOpen(true) }
  function onSubmit(data) { editing ? updateDept(editing.id, data) : addDept(data); setOpen(false) }

  const getUserName = id => users.find(u => u.id === id)?.name ?? '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-slate-800">Quản lý Phòng ban</h2><p className="text-slate-500 text-sm mt-1">{departments.length} phòng ban</p></div>
        <Button onClick={openAdd} icon={<Plus size={16} />}>Thêm phòng ban</Button>
      </div>
      <Card padding={false}>
        <table className="w-full">
          <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Phòng ban</th><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Mã</th><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Trưởng phòng</th><th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map(dept => (
              <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: dept.color }} /><span className="font-medium text-slate-800 text-sm">{dept.name}</span></div></td>
                <td className="px-4 py-3 text-center"><Badge color="blue">{dept.code}</Badge></td>
                <td className="px-4 py-3 text-sm text-slate-600">{getUserName(dept.managerId)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(dept)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"><Pencil size={14} /></button>
                    <button onClick={() => confirm(`Xóa "${dept.name}"?`) && deleteDept(dept.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa phòng ban' : 'Thêm phòng ban'} footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button><Button onClick={handleSubmit(onSubmit)}>{editing ? 'Lưu' : 'Thêm'}</Button></>}>
        <div className="space-y-3">
          <Input label="Tên phòng ban *" {...register('name', { required: true })} error={errors.name && 'Bắt buộc'} />
          <Input label="Mã phòng ban *" {...register('code', { required: true })} />
          <Input label="Màu" type="color" {...register('color')} className="h-10 cursor-pointer" />
        </div>
      </Modal>
    </div>
  )
}
