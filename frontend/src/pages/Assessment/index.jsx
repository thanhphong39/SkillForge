import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Users, TrendingUp, CheckCircle2, Circle, Edit3, Save, X,
  ChevronRight, AlertCircle, BarChart2, Target, Award,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAssessmentStore } from '../../store/assessmentStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'

const CATEGORY_META = {
  leadership: { label: 'Lãnh đạo & Cam kết', color: 'blue',   icon: Award },
  data:        { label: 'Hệ thống Dữ liệu',   color: 'purple', icon: BarChart2 },
  process:     { label: 'Quy trình & Kế hoạch', color: 'emerald', icon: Target },
  culture:     { label: 'Văn hóa Tổ chức',    color: 'amber',  icon: Users },
}

const COLOR_MAP = {
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700',    bar: '#3b82f6' },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200',  text: 'text-purple-700',  badge: 'bg-purple-100 text-purple-700',  bar: '#8b5cf6' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', bar: '#10b981' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',   bar: '#f59e0b' },
}

const BSC_EXPERIENCE_OPTIONS = [
  { value: 'none',        label: 'Chưa có kinh nghiệm' },
  { value: 'partial',     label: 'Đã tìm hiểu cơ bản' },
  { value: 'experienced', label: 'Đã triển khai trước đây' },
]

function MetricTile({ label, value, unit, color = 'blue', icon: Icon }) {
  const c = COLOR_MAP[color]
  return (
    <div className={`rounded-xl p-4 ${c.bg} border ${c.border}`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={15} className={c.text} />}
        <span className={`text-xs font-medium ${c.text}`}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${c.text}`}>{value}</span>
        {unit && <span className={`text-xs ${c.text} opacity-70`}>{unit}</span>}
      </div>
    </div>
  )
}

function ReadinessCategory({ category, items, onToggle }) {
  const meta = CATEGORY_META[category]
  const c = COLOR_MAP[meta.color]
  const Icon = meta.icon
  const checked = items.filter((i) => i.checked).length
  const pct = Math.round((checked / items.length) * 100)

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className={c.text} />
          <span className={`text-sm font-semibold ${c.text}`}>{meta.label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/60 rounded-full mb-3 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: c.bar }} />
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-2.5 cursor-pointer group">
            <button
              onClick={() => onToggle(item.id)}
              className="mt-0.5 shrink-0"
            >
              {item.checked
                ? <CheckCircle2 size={16} className={c.text} />
                : <Circle size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
              }
            </button>
            <div>
              <p className={`text-xs font-medium leading-snug ${item.checked ? c.text : 'text-slate-600'}`}>{item.label}</p>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{item.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 text-white rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold">{label}</p>
      <p className="text-blue-300">{payload[0].value} tỷ đồng</p>
    </div>
  )
}

export default function AssessmentPage() {
  const { profile, readinessItems, financialSnapshot, updateProfile, toggleReadinessItem } = useAssessmentStore()
  const { markStepComplete } = useBSCWorkflowStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)

  const totalItems = readinessItems.length
  const checkedItems = readinessItems.filter((i) => i.checked).length
  const overallPct = Math.round((checkedItems / totalItems) * 100)

  const categories = ['leadership', 'data', 'process', 'culture']
  const itemsByCategory = (cat) => readinessItems.filter((i) => i.category === cat)

  const revenueData = financialSnapshot.years.map((year, i) => ({
    year, revenue: financialSnapshot.revenue[i], profit: financialSnapshot.profit[i],
  }))

  const handleSaveProfile = () => {
    updateProfile(draft)
    setEditing(false)
  }

  const handleComplete = () => {
    markStepComplete('B1')
    navigate('/strategy-build/swot')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đánh giá Hiện trạng</h1>
          <p className="text-sm text-slate-500 mt-1">Phân tích tình hình công ty trước khi triển khai BSC</p>
        </div>
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-blue-500/30"
        >
          Hoàn thành Bước 1
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: Company Profile */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-800 text-sm">Hồ sơ Công ty</h2>
              </div>
              {!editing ? (
                <button onClick={() => { setDraft(profile); setEditing(true) }} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                  <Edit3 size={13} /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800"><Save size={13} /> Lưu</button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"><X size={13} /> Hủy</button>
                </div>
              )}
            </div>

            {/* Logo placeholder */}
            <div className="px-5 py-4 flex items-center gap-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <div className="font-bold text-slate-900">{profile.name}</div>
                <div className="text-xs text-slate-400">{profile.website}</div>
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              {editing ? (
                <>
                  <Field label="Ngành nghề">
                    <input className="field-input" value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} />
                  </Field>
                  <Field label="Số nhân viên">
                    <input type="number" className="field-input" value={draft.employeeCount} onChange={(e) => setDraft({ ...draft, employeeCount: +e.target.value })} />
                  </Field>
                  <Field label="Doanh thu hàng năm">
                    <input className="field-input" value={draft.annualRevenue} onChange={(e) => setDraft({ ...draft, annualRevenue: e.target.value })} />
                  </Field>
                  <Field label="Kinh nghiệm BSC">
                    <select className="field-input" value={draft.bscExperience} onChange={(e) => setDraft({ ...draft, bscExperience: e.target.value })}>
                      {BSC_EXPERIENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                </>
              ) : (
                <>
                  <InfoRow label="Ngành nghề" value={profile.industry} />
                  <InfoRow label="Năm thành lập" value={profile.foundedYear} />
                  <InfoRow label="Nhân viên" value={`${profile.employeeCount} người`} />
                  <InfoRow label="Doanh thu" value={profile.annualRevenue} />
                  <InfoRow label="KN BSC" value={BSC_EXPERIENCE_OPTIONS.find((o) => o.value === profile.bscExperience)?.label} />
                </>
              )}
            </div>

            {/* Challenges */}
            <div className="px-5 pb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Thách thức hiện tại</p>
              <ul className="space-y-1.5">
                {profile.currentChallenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <AlertCircle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Financial KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <MetricTile label="Tăng trưởng" value={`+${financialSnapshot.growthRate}`} unit="%" color="blue" icon={TrendingUp} />
            <MetricTile label="Biên LN" value={financialSnapshot.profitMargin} unit="%" color="emerald" icon={Target} />
            <MetricTile label="DT/NV" value={financialSnapshot.revenuePerEmployee} unit="tỷ" color="purple" icon={Users} />
          </div>
        </div>

        {/* CENTER + RIGHT */}
        <div className="xl:col-span-2 space-y-4">
          {/* Financial Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                  <BarChart2 size={16} className="text-blue-600" />
                  Kết quả Tài chính 3 năm gần nhất
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Đơn vị: Tỷ đồng</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Doanh thu</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Lợi nhuận</span>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#3b82f6" name="Doanh thu">
                    {revenueData.map((_, i) => <Cell key={i} fill={i === revenueData.length - 1 ? '#2563eb' : '#93c5fd'} />)}
                  </Bar>
                  <Bar dataKey="profit" radius={[6, 6, 0, 0]} fill="#10b981" name="Lợi nhuận">
                    {revenueData.map((_, i) => <Cell key={i} fill={i === revenueData.length - 1 ? '#059669' : '#6ee7b7'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Readiness Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Đánh giá Mức độ Sẵn sàng
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Đánh dấu các tiêu chí đã đáp ứng</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{overallPct}<span className="text-sm text-slate-400">%</span></div>
                  <div className="text-[10px] text-slate-400">{checkedItems}/{totalItems} tiêu chí</div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 ${
                  overallPct >= 75 ? 'border-emerald-400 text-emerald-600' :
                  overallPct >= 50 ? 'border-blue-400 text-blue-600' :
                  'border-amber-400 text-amber-600'
                }`}>
                  {overallPct >= 75 ? '✓' : overallPct >= 50 ? '~' : '!'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <ReadinessCategory
                  key={cat}
                  category={cat}
                  items={itemsByCategory(cat)}
                  onToggle={toggleReadinessItem}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-blue-500/30"
        >
          Tiếp theo: Phân tích SWOT
          <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        .field-input { width:100%; border:1px solid #e2e8f0; border-radius:8px; padding:6px 10px; font-size:13px; outline:none; transition:border-color .15s; }
        .field-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  )
}
