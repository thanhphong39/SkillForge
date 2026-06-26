import { useForm } from 'react-hook-form'
import { useAdminStore } from '../../store/adminStore.js'
import { toast } from '../../components/ui/toast.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Save, Building2, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

const INDUSTRIES = [
  { value: 'manufacturing', label: 'Sản xuất' },
  { value: 'trading',       label: 'Thương mại' },
  { value: 'services',      label: 'Dịch vụ' },
  { value: 'technology',    label: 'Công nghệ thông tin' },
  { value: 'construction',  label: 'Xây dựng' },
  { value: 'finance',       label: 'Tài chính - Ngân hàng' },
  { value: 'healthcare',    label: 'Y tế - Dược phẩm' },
  { value: 'education',     label: 'Giáo dục - Đào tạo' },
  { value: 'other',         label: 'Khác' },
]

export default function CompanySetupPage() {
  const { company, updateCompany } = useAdminStore()
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, reset } = useForm({ defaultValues: company })

  // Sync form when store data loads from API
  useEffect(() => { reset(company) }, [company.name])

  async function onSubmit(data) {
    await updateCompany(data)
    setSaved(true)
    toast.success('Đã lưu cấu hình công ty thành công!')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic info */}
        <Card>
          <CardHeader
            title="Thông tin cơ bản"
            subtitle="Tên công ty và nhận diện thương hiệu"
            action={<Building2 size={18} className="text-slate-400" />}
          />
          <div className="space-y-4">
            <Input
              label="Tên công ty *"
              placeholder="Công ty CP Thiên Phú"
              {...register('name', { required: true })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Tên viết tắt"
                placeholder="Thiên Phú"
                {...register('shortName')}
              />
              <Input
                label="Mã số thuế"
                placeholder="0123456789"
                {...register('taxCode')}
              />
            </div>
            <Select label="Lĩnh vực hoạt động" {...register('industry')}>
              <option value="">-- Chọn lĩnh vực --</option>
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </Select>
          </div>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader title="Thông tin liên hệ" subtitle="Địa chỉ, điện thoại, email công ty" />
          <div className="space-y-4">
            <Input
              label="Địa chỉ"
              placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
              {...register('address')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Điện thoại"
                placeholder="028 1234 5678"
                {...register('phone')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="info@company.vn"
                {...register('email')}
              />
            </div>
            <Input
              label="Website"
              placeholder="www.company.vn"
              {...register('website')}
            />
          </div>
        </Card>

        {/* Fiscal year */}
        <Card>
          <CardHeader
            title="Cài đặt năm tài chính"
            subtitle="Cấu hình kỳ báo cáo BSC"
            action={<Info size={16} className="text-slate-400" />}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Tháng bắt đầu năm tài chính"
              {...register('fiscalYearStart', { valueAsNumber: true })}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </Select>
            <Input
              label="Năm tài chính hiện tại"
              type="number"
              min={2000}
              max={2100}
              {...register('currentYear', { valueAsNumber: true })}
            />
          </div>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              Năm tài chính sẽ được dùng để tạo và lọc các kỳ BSC. Thay đổi sẽ ảnh hưởng toàn bộ hệ thống.
            </p>
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

