import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, CheckCircle2, Clock, Calendar } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore.js'
import { toast } from '../../components/ui/toast.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Modal } from '../../components/ui/Modal.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

const QUARTERS = [1, 2, 3, 4]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i)

function buildLabel(year, quarter) {
  return `Q${quarter}/${year}`
}

export default function PeriodManagementPage() {
  const { periods, addPeriod, updatePeriod, deletePeriod, setActivePeriod } = useAdminStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

  const watchYear = watch('year')
  const watchQuarter = watch('quarter')

  function openAdd() {
    setEditing(null)
    reset({ year: CURRENT_YEAR, quarter: 1, startDate: '', endDate: '' })
    setOpen(true)
  }

  function openEdit(period) {
    setEditing(period)
    reset(period)
    setOpen(true)
  }

  function onSubmit(data) {
    const payload = {
      ...data,
      year: Number(data.year),
      quarter: Number(data.quarter),
      label: buildLabel(data.year, data.quarter),
    }
    if (editing) {
      updatePeriod(editing.id, payload)
      toast.success(`Đã cập nhật kỳ ${payload.label}`)
    } else {
      addPeriod(payload)
      toast.success(`Đã thêm kỳ ${payload.label}`)
    }
    setOpen(false)
  }

  const sorted = [...periods].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year
    return b.quarter - a.quarter
  })

  const activePeriod = periods.find((p) => p.isActive)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý Kỳ BSC</h2>
          <p className="text-slate-500 text-sm mt-1">
            {periods.length} kỳ &middot;{' '}
            {activePeriod
              ? <span className="text-emerald-600 font-medium">Kỳ hiện tại: {activePeriod.label}</span>
              : <span className="text-amber-600">Chưa có kỳ active</span>
            }
          </p>
        </div>
        <Button onClick={openAdd} icon={<Plus size={16} />}>Thêm kỳ</Button>
      </div>

      {/* Active period banner */}
      {activePeriod && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-emerald-800">Kỳ đang hoạt động: {activePeriod.label}</div>
            <div className="text-xs text-emerald-600 mt-0.5">
              {activePeriod.startDate} → {activePeriod.endDate}
            </div>
          </div>
        </div>
      )}

      <Card padding={false}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Kỳ</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Ngày bắt đầu</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-left">Ngày kết thúc</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Trạng thái</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">
                  <Calendar size={28} className="mx-auto mb-2 text-slate-300" />
                  Chưa có kỳ BSC nào. Nhấn &quot;Thêm kỳ&quot; để bắt đầu.
                </td>
              </tr>
            )}
            {sorted.map((period) => (
              <tr key={period.id} className={`hover:bg-slate-50 transition-colors ${period.isActive ? 'bg-emerald-50/50' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${period.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="font-semibold text-slate-800 text-sm">{period.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{period.startDate || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{period.endDate || '—'}</td>
                <td className="px-4 py-3 text-center">
                  {period.isActive
                    ? <Badge color="green"><CheckCircle2 size={10} className="inline mr-1" />Đang hoạt động</Badge>
                    : <Badge color="slate"><Clock size={10} className="inline mr-1" />Không active</Badge>
                  }
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {!period.isActive && (
                      <button
                        onClick={() => { setActivePeriod(period.id); toast.success(`Đã chuyển sang kỳ ${period.label}`) }}
                        className="px-2 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded cursor-pointer transition-colors font-medium"
                      >
                        Chọn active
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(period)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (period.isActive) return toast.warning('Không thể xóa kỳ đang active.')
                        if (confirm(`Xóa kỳ "${period.label}"?`)) { deletePeriod(period.id); toast.success(`Đã xóa kỳ "${period.label}"`) }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Sửa kỳ BSC' : 'Thêm kỳ BSC'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editing ? 'Lưu' : 'Thêm'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Năm"
              {...register('year', { required: true })}
            >
              {YEARS.map((y) => <option key={y} value={y}>Năm {y}</option>)}
            </Select>
            <Select
              label="Quý"
              {...register('quarter', { required: true })}
            >
              {QUARTERS.map((q) => <option key={q} value={q}>Quý {q}</option>)}
            </Select>
          </div>

          {(watchYear && watchQuarter) && (
            <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700 font-medium">
              Nhãn kỳ: {buildLabel(watchYear, watchQuarter)}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ngày bắt đầu"
              type="date"
              {...register('startDate')}
            />
            <Input
              label="Ngày kết thúc"
              type="date"
              {...register('endDate')}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

