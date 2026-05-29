import { useForm } from 'react-hook-form'
import { useAdminStore } from '../../store/adminStore.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Save } from 'lucide-react'
import { useState } from 'react'

export default function CompanySetupPage() {
  const { company, updateCompany } = useAdminStore()
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit } = useForm({ defaultValues: company })

  function onSubmit(data) {
    updateCompany(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6"><h2 className="text-xl font-bold text-slate-800">Cấu hình Công ty</h2><p className="text-slate-500 text-sm mt-1">Thông tin chung và năm tài chính</p></div>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Tên công ty" {...register('name')} />
          <Input label="Tên viết tắt" {...register('shortName')} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tháng bắt đầu năm tài chính" {...register('fiscalYearStart', { valueAsNumber: true })}>
              {Array.from({ length: 12 }, (_, i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
            </Select>
            <Input label="Năm hiện tại" type="number" {...register('currentYear', { valueAsNumber: true })} />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" icon={<Save size={16} />} variant={saved ? 'success' : 'primary'}>
              {saved ? 'Đã lưu!' : 'Lưu cấu hình'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
