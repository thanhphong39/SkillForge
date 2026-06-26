import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Plus, Users, UserCircle2 } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore.js'
import { Card } from '../../components/ui/Card.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { toast } from '../../components/ui/toast.jsx'

export default function DepartmentSetupPage() {
  const { departments, users, addDept, updateDept, deleteDept, init } = useAdminStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { init() }, [])

  function openAdd() {
    setEditing(null)
    reset({ name: '', code: '', color: '#3b82f6', managerId: '' })
    setOpen(true)
  }

  function openEdit(dept) {
    setEditing(dept)
    reset(dept)
    setOpen(true)
  }

  async function onSubmit(data) {
    if (editing) {
      await updateDept(editing.id, data)
      toast.success(`Đã cập nhật phòng ban "${data.name}"`)
    } else {
      await addDept(data)
      toast.success(`Đã thêm phòng ban "${data.name}"`)
    }
    setOpen(false)
  }

  const getMemberCount = (deptId) => users.filter((u) => u.deptId === deptId).length
  const getManager = (managerId) => users.find((u) => u.id === managerId)

  // Available managers (admin + manager role)
  const eligibleManagers = users.filter((u) => u.role === 'manager' || u.role === 'admin')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Phòng ban</h2>
          <p className="text-slate-500 text-sm mt-1">{departments.length} phòng ban</p>
        </div>
        <Button onClick={openAdd} icon={<Plus size={16} />}>Thêm phòng ban</Button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {departments.map((dept) => {
          const memberCount = getMemberCount(dept.id)
          const manager = getManager(dept.managerId)
          return (
            <Card key={dept.id} className="relative overflow-hidden">
              {/* Color accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                style={{ backgroundColor: dept.color }}
              />
              <div className="pt-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: dept.color }}
                    >
                      {dept.code?.slice(0, 2) ?? '??'}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{dept.name}</div>
                      <Badge color="blue" className="mt-0.5">{dept.code}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(dept)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (memberCount > 0) return toast.error(`Phòng ban còn ${memberCount} người dùng. Hãy chuyển họ sang phòng khác trước.`)
                        if (confirm(`Xóa phòng ban "${dept.name}"?`)) { deleteDept(dept.id); toast.success(`Đã xóa phòng ban "${dept.name}"`) }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <UserCircle2 size={14} className="text-slate-400 shrink-0" />
                    {manager
                      ? <span>{manager.name} <span className="text-slate-400 text-xs">({manager.title})</span></span>
                      : <span className="text-slate-400 italic">Chưa có trưởng phòng</span>
                    }
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users size={14} className="text-slate-400 shrink-0" />
                    <span>{memberCount} thành viên</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}

        {departments.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Users size={36} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Chưa có phòng ban nào</p>
            <p className="text-slate-400 text-sm mt-1">Nhấn &quot;Thêm phòng ban&quot; để bắt đầu.</p>
          </div>
        )}
      </div>

      {/* Table view */}
      {departments.length > 0 && (
        <Card padding={false}>
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh sách chi tiết</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Phòng ban</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Mã</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Trưởng phòng</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Thành viên</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => {
                const memberCount = getMemberCount(dept.id)
                const manager = getManager(dept.managerId)
                return (
                  <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                        <span className="font-medium text-slate-800 text-sm">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><Badge color="blue">{dept.code}</Badge></td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {manager?.name ?? <span className="text-slate-400 italic text-xs">Chưa phân công</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-slate-700">{memberCount}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(dept)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"><Pencil size={14} /></button>
                        <button
                          onClick={() => {
                            if (memberCount > 0) return toast.error(`Phòng ban còn ${memberCount} người dùng.`)
                            if (confirm(`Xóa "${dept.name}"?`)) { deleteDept(dept.id); toast.success(`Đã xóa "${dept.name}"`) }
                          }}
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
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Sửa phòng ban' : 'Thêm phòng ban'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editing ? 'Lưu thay đổi' : 'Thêm phòng ban'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Tên phòng ban *"
            placeholder="Kinh doanh"
            {...register('name', { required: 'Bắt buộc' })}
            error={errors.name?.message}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Mã phòng ban *"
              placeholder="KD"
              {...register('code', { required: 'Bắt buộc' })}
              error={errors.code?.message}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Màu nhận diện</label>
              <input
                type="color"
                {...register('color')}
                className="h-10 w-full rounded-lg border border-slate-300 cursor-pointer p-1"
              />
            </div>
          </div>
          <Select label="Trưởng phòng" {...register('managerId')}>
            <option value="">-- Chưa phân công --</option>
            {eligibleManagers.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.title})</option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  )
}

