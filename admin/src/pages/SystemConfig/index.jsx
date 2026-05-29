import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAdminStore } from '../../store/adminStore.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'

export default function SystemConfigPage() {
  const { ratingThresholds, updateRatingThresholds } = useAdminStore()
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit } = useForm({ defaultValues: ratingThresholds })

  function onSubmit(data) {
    updateRatingThresholds({ excellent: +data.excellent, good: +data.good, average: +data.average })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-md">
      <div className="mb-6"><h2 className="text-xl font-bold text-slate-800">Cấu hình Hệ thống</h2><p className="text-slate-500 text-sm mt-1">Ngưỡng xếp loại KPI</p></div>
      <Card>
        <CardHeader title="Ngưỡng xếp loại đánh giá" subtitle="% hoàn thành để đạt từng mức xếp loại" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">🟢</span>
            <div className="flex-1"><div className="text-sm font-semibold text-green-800">Xuất sắc</div><div className="text-xs text-green-600">Hoàn thành ≥ X%</div></div>
            <Input type="number" {...register('excellent')} className="w-24" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">🔵</span>
            <div className="flex-1"><div className="text-sm font-semibold text-blue-800">Tốt</div><div className="text-xs text-blue-600">Hoàn thành ≥ X%</div></div>
            <Input type="number" {...register('good')} className="w-24" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <span className="text-2xl">🟡</span>
            <div className="flex-1"><div className="text-sm font-semibold text-yellow-800">Trung bình</div><div className="text-xs text-yellow-600">Hoàn thành ≥ X%</div></div>
            <Input type="number" {...register('average')} className="w-24" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <span className="text-2xl">🔴</span>
            <div className="flex-1"><div className="text-sm font-semibold text-red-800">Yếu</div><div className="text-xs text-red-600">Dưới ngưỡng Trung bình</div></div>
            <span className="w-24 text-center text-sm text-red-600 font-medium">Tự động</span>
          </div>
          <Button type="submit" className="w-full justify-center" variant={saved ? 'success' : 'primary'}>
            {saved ? 'Đã lưu!' : 'Lưu cấu hình'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
