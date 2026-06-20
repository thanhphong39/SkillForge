import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAdminStore } from '../../store/adminStore.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Save, TrendingUp, Info } from 'lucide-react'

const RATING_LEVELS = [
  {
    key: 'excellent',
    label: 'Xuất sắc',
    desc: 'Hoàn thành vượt mục tiêu',
    color: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-800',
    sub: 'text-emerald-600',
    input: 'focus:ring-emerald-500',
  },
  {
    key: 'good',
    label: 'Tốt',
    desc: 'Đạt gần hoặc đúng mục tiêu',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-800',
    sub: 'text-blue-600',
    input: 'focus:ring-blue-500',
  },
  {
    key: 'average',
    label: 'Trung bình',
    desc: 'Đạt một phần mục tiêu',
    color: 'amber',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    sub: 'text-amber-600',
    input: 'focus:ring-amber-500',
  },
]

export default function SystemConfigPage() {
  const { ratingThresholds, updateRatingThresholds } = useAdminStore()
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, watch } = useForm({ defaultValues: ratingThresholds })

  const watchExcellent = watch('excellent')
  const watchGood = watch('good')
  const watchAverage = watch('average')

  function onSubmit(data) {
    updateRatingThresholds({
      excellent: Number(data.excellent),
      good: Number(data.good),
      average: Number(data.average),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-lg space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <CardHeader
            title="Ngưỡng xếp loại KPI"
            subtitle="Cấu hình % hoàn thành để đạt từng mức đánh giá"
            action={<TrendingUp size={18} className="text-slate-400" />}
          />

          <div className="space-y-3">
            {RATING_LEVELS.map(({ key, label, desc, bg, border, dot, text, sub, input }) => (
              <div key={key} className={`flex items-center gap-4 p-4 ${bg} border ${border} rounded-xl`}>
                <div className={`w-3 h-3 rounded-full shrink-0 ${dot}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${text}`}>{label}</div>
                  <div className={`text-xs mt-0.5 ${sub}`}>{desc}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-xs font-medium ${sub}`}>≥</span>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    {...register(key, { valueAsNumber: true })}
                    className={`w-20 text-center rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 ${input}`}
                  />
                  <span className={`text-xs font-medium ${sub}`}>%</span>
                </div>
              </div>
            ))}

            {/* Auto: poor */}
            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="w-3 h-3 rounded-full shrink-0 bg-red-500" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-red-800">Yếu</div>
                <div className="text-xs mt-0.5 text-red-600">Không đạt ngưỡng Trung bình</div>
              </div>
              <div className="shrink-0">
                <span className="text-sm font-semibold text-red-700 bg-red-100 px-3 py-1.5 rounded-lg">&lt; {watchAverage ?? ratingThresholds.average}%</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 mb-2">
              <Info size={13} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Thứ tự ưu tiên</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
              <span className="text-emerald-700 font-semibold">Xuất sắc ≥{watchExcellent ?? ratingThresholds.excellent}%</span>
              <span className="text-slate-300">›</span>
              <span className="text-blue-700 font-semibold">Tốt ≥{watchGood ?? ratingThresholds.good}%</span>
              <span className="text-slate-300">›</span>
              <span className="text-amber-700 font-semibold">TB ≥{watchAverage ?? ratingThresholds.average}%</span>
              <span className="text-slate-300">›</span>
              <span className="text-red-700 font-semibold">Yếu</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            icon={<Save size={16} />}
            variant={saved ? 'success' : 'primary'}
          >
            {saved ? 'Đã lưu thành công!' : 'Lưu cấu hình'}
          </Button>
        </div>
      </form>
    </div>
  )
}
