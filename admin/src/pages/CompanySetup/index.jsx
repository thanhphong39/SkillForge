import { useForm } from 'react-hook-form'
import { useAdminStore } from '../../store/adminStore.js'
import { toast } from '../../components/ui/toast.jsx'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Input, Select } from '../../components/ui/Input.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Save, Building2, Info, PlusCircle, CheckCircle2, Loader2 } from 'lucide-react'
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

const SIZES = [
  { value: 'micro',  label: 'Siêu nhỏ (< 10 người)' },
  { value: 'small',  label: 'Nhỏ (10 – 50 người)' },
  { value: 'medium', label: 'Vừa (51 – 200 người)' },
  { value: 'large',  label: 'Lớn (> 200 người)' },
]

export default function CompanySetupPage() {
  const { company, companyId, loading, createCompany, updateCompany, init } = useAdminStore()
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: company,
  })

  // On mount: if companyId exists, fetch latest from DB
  useEffect(() => {
    if (companyId) init()
  }, [companyId])

  // Sync form whenever store company data changes (loaded from BE)
  useEffect(() => {
    reset(company)
  }, [company.name, company.taxCode, company.industry])

  const isNew = !companyId

  async function onSubmit(data) {
    setSubmitting(true)
    setSaved(false)
    try {
      if (isNew) {
        // First time: POST /companies
        const result = await createCompany(data)
        if (result.ok) {
          toast.success(`Đã tạo công ty "${data.name}" thành công!`)
          setSaved(true)
        } else {
          toast.error(`Lỗi tạo công ty: ${result.error}`)
        }
      } else {
        // Update: PUT /companies/{id}
        const result = await updateCompany(data)
        if (result.ok !== false) {
          toast.success('Đã lưu cấu hình công ty thành công!')
          setSaved(true)
        } else {
          toast.error(`Lỗi lưu: ${result.error}`)
        }
      }
    } finally {
      setSubmitting(false)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Status banner */}
      {isNew ? (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <Info size={18} className="shrink-0 mt-0.5 text-amber-500" />
          <div>
            <p className="font-semibold text-sm">Chưa có thông tin công ty</p>
            <p className="text-xs mt-0.5">
              Điền đầy đủ thông tin bên dưới và nhấn <strong>Tạo công ty</strong> để bắt đầu.
              Sau khi tạo, bạn có thể cập nhật bất kỳ lúc nào.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Công ty đã được cấu hình. Mã công ty: <code className="font-mono text-xs bg-emerald-100 px-1.5 py-0.5 rounded">{companyId}</code></span>
        </div>
      )}

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
              {...register('name', { required: 'Vui lòng nhập tên công ty' })}
              error={errors.name?.message}
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
            <div className="grid grid-cols-2 gap-3">
              <Select label="Lĩnh vực hoạt động" {...register('industry')}>
                <option value="">-- Chọn lĩnh vực --</option>
                {INDUSTRIES.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </Select>
              <Select label="Quy mô công ty" {...register('size')}>
                <option value="">-- Chọn quy mô --</option>
                {SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </div>
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
                label="Email công ty"
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

        <div className="flex items-center justify-between">
          {!isNew && (
            <p className="text-xs text-slate-400">
              {isDirty ? '⚠ Có thay đổi chưa lưu' : '✓ Đã đồng bộ với database'}
            </p>
          )}
          <div className="ml-auto">
            <Button
              type="submit"
              icon={
                submitting ? <Loader2 size={16} className="animate-spin" /> :
                saved       ? <CheckCircle2 size={16} /> :
                isNew       ? <PlusCircle size={16} /> : <Save size={16} />
              }
              variant={saved ? 'success' : 'primary'}
              disabled={submitting || loading}
            >
              {submitting ? (isNew ? 'Đang tạo...' : 'Đang lưu...') :
               saved       ? 'Đã lưu thành công!' :
               isNew       ? 'Tạo công ty' : 'Lưu cấu hình'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
