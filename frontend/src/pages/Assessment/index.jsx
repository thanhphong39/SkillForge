import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, Plus, Trash2, Edit3, Save, X, AlertCircle,
  BarChart2, PieChart as PieIcon, Layers, Star, Zap, Shield, Target, TrendingUp,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAssessmentStore } from '../../store/assessmentStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { toast } from '../../components/ui/toast.jsx'

const PIE_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#a855f7']

// ────────────────────────────────────────────────────────────
// Reusable section card
// ────────────────────────────────────────────────────────────
function SectionCard({ icon: Icon, iconColor = 'text-blue-600', title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className={`p-2 rounded-xl bg-white border border-slate-200 ${iconColor}`}>
          <Icon size={16} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 text-sm">{title}</h2>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Dynamic text list
// ────────────────────────────────────────────────────────────
function DynamicTextList({ items, onAdd, onUpdate, onRemove, placeholder = 'Thêm mục mới...' }) {
  const [addText, setAddText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleAdd = () => {
    const trimmed = addText.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setAddText('')
  }

  const handleStartEdit = (item) => {
    setEditingId(item.id)
    setEditText(item.value)
  }

  const handleSaveEdit = () => {
    const trimmed = editText.trim()
    if (!trimmed) return
    onUpdate(editingId, trimmed)
    setEditingId(null)
  }

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 group min-h-8">
          {editingId === item.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit()
                  if (e.key === 'Escape') setEditingId(null)
                }}
                className="flex-1 text-sm border border-blue-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-100"
                autoFocus
              />
              <button onClick={handleSaveEdit} className="text-emerald-600 hover:text-emerald-700 shrink-0">
                <Save size={14} />
              </button>
              <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600 shrink-0">
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="flex-1 text-sm text-slate-700">{item.value}</span>
              <button
                onClick={() => handleStartEdit(item)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity shrink-0"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      ))}

      <div className="flex items-center gap-2 pt-1">
        <input
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="flex-1 text-sm border border-dashed border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50"
        />
        <button
          onClick={handleAdd}
          disabled={!addText.trim()}
          className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors shrink-0"
        >
          <Plus size={12} /> Thêm
        </button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 4.1 Financial section
// ────────────────────────────────────────────────────────────
function FinancialSection() {
  const { financial, addFinancialYear, updateFinancialYear, removeFinancialYear } = useAssessmentStore()
  const currentYear = new Date().getFullYear()
  const [newRow, setNewRow] = useState({ year: currentYear + 1, revenue: '', profit: '' })

  const handleAddYear = () => {
    const y = Number(newRow.year)
    const r = Number(newRow.revenue)
    const p = Number(newRow.profit)
    if (!y || newRow.revenue === '') return
    if (financial.some((f) => f.year === y)) return
    addFinancialYear(y, r, p)
    setNewRow({ year: y + 1, revenue: '', profit: '' })
  }

  const chartData = [...financial]
    .sort((a, b) => a.year - b.year)
    .map((r) => ({ year: String(r.year), revenue: r.revenue, profit: r.profit }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-slate-800 text-white rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-300">Doanh thu: {payload[0]?.value} tỷ</p>
        <p className="text-emerald-300">Lợi nhuận: {payload[1]?.value} tỷ</p>
      </div>
    )
  }

  return (
    <SectionCard icon={BarChart2} title="4.1 Tài chính" subtitle="Tối đa 3 năm · Đơn vị: Tỷ đồng">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                <th className="text-left pb-2">Năm</th>
                <th className="text-right pb-2">Doanh thu (tỷ)</th>
                <th className="text-right pb-2">Lợi nhuận (tỷ)</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financial.map((row) => (
                <FinancialRow key={row.id} row={row} onUpdate={updateFinancialYear} onRemove={removeFinancialYear} />
              ))}
            </tbody>
          </table>

          {financial.length < 3 && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                value={newRow.year}
                onChange={(e) => setNewRow({ ...newRow, year: e.target.value })}
                className="w-20 text-sm border border-dashed border-slate-300 rounded-lg px-2 py-1.5 text-center outline-none focus:border-blue-400 bg-slate-50"
                placeholder="Năm"
              />
              <input
                type="number"
                min="0"
                value={newRow.revenue}
                onChange={(e) => setNewRow({ ...newRow, revenue: e.target.value })}
                className="w-24 text-sm border border-dashed border-slate-300 rounded-lg px-2 py-1.5 text-right outline-none focus:border-blue-400 bg-slate-50"
                placeholder="DT"
              />
              <input
                type="number"
                value={newRow.profit}
                onChange={(e) => setNewRow({ ...newRow, profit: e.target.value })}
                className="w-24 text-sm border border-dashed border-slate-300 rounded-lg px-2 py-1.5 text-right outline-none focus:border-blue-400 bg-slate-50"
                placeholder="LN"
              />
              <button
                onClick={handleAddYear}
                disabled={!newRow.revenue && newRow.revenue !== 0}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors shrink-0"
              >
                <Plus size={12} /> Thêm
              </button>
            </div>
          )}
          {financial.length >= 3 && (
            <p className="mt-2 text-xs text-slate-400 italic">Đã đạt tối đa 3 năm</p>
          )}
        </div>

        {/* Bar chart */}
        <div>
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Doanh thu</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Lợi nhuận</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#3b82f6" name="Doanh thu" />
                <Bar dataKey="profit" radius={[6, 6, 0, 0]} fill="#10b981" name="Lợi nhuận" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function FinancialRow({ row, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ revenue: row.revenue, profit: row.profit })

  const handleSave = () => {
    onUpdate(row.id, { revenue: Number(draft.revenue), profit: Number(draft.profit) })
    setEditing(false)
  }

  if (editing) {
    return (
      <tr>
        <td className="py-2 pr-2 font-semibold text-slate-700">{row.year}</td>
        <td className="py-2 pr-2">
          <input
            type="number" min="0" value={draft.revenue}
            onChange={(e) => setDraft({ ...draft, revenue: e.target.value })}
            className="w-full text-right border border-blue-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </td>
        <td className="py-2 pr-2">
          <input
            type="number" value={draft.profit}
            onChange={(e) => setDraft({ ...draft, profit: e.target.value })}
            className="w-full text-right border border-blue-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </td>
        <td className="py-2">
          <div className="flex gap-1 justify-end">
            <button onClick={handleSave} className="text-emerald-600 hover:text-emerald-700"><Save size={14} /></button>
            <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="group">
      <td className="py-2 pr-2 font-semibold text-slate-700">{row.year}</td>
      <td className="py-2 pr-2 text-right text-slate-600">{row.revenue.toLocaleString()}</td>
      <td className="py-2 pr-2 text-right text-slate-600">{row.profit.toLocaleString()}</td>
      <td className="py-2">
        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-blue-600"><Edit3 size={13} /></button>
          <button onClick={() => onRemove(row.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
        </div>
      </td>
    </tr>
  )
}

// ────────────────────────────────────────────────────────────
// 4.2 Market Share section
// ────────────────────────────────────────────────────────────
function MarketShareSection() {
  const { marketShareCurrent, marketShareFuture, addMarketShareEntry, updateMarketShareEntry, removeMarketShareEntry } = useAssessmentStore()

  const totalCurrent = marketShareCurrent.reduce((s, r) => s + (Number(r.percentage) || 0), 0)
  const totalFuture = marketShareFuture.reduce((s, r) => s + (Number(r.percentage) || 0), 0)

  return (
    <SectionCard icon={PieIcon} title="4.2 Thị phần" subtitle="Tổng thị phần mỗi biểu đồ phải bằng 100%">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <MarketSharePanel
          label="Thị phần hiện tại"
          type="current"
          entries={marketShareCurrent}
          total={totalCurrent}
          onAdd={addMarketShareEntry}
          onUpdate={updateMarketShareEntry}
          onRemove={removeMarketShareEntry}
        />
        <MarketSharePanel
          label="Thị phần tương lai"
          type="future"
          entries={marketShareFuture}
          total={totalFuture}
          onAdd={addMarketShareEntry}
          onUpdate={updateMarketShareEntry}
          onRemove={removeMarketShareEntry}
        />
      </div>
    </SectionCard>
  )
}

function MarketSharePanel({ label, type, entries, total, onAdd, onUpdate, onRemove }) {
  const isValid = Math.abs(total - 100) < 0.01

  const pieData = entries
    .filter((e) => e.name && Number(e.percentage) > 0)
    .map((e) => ({ name: e.name, value: Number(e.percentage) }))

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
          Tổng: {total}%
        </span>
      </div>

      {/* Pie chart */}
      {pieData.length > 0 && (
        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false} fontSize={11}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <table className="w-full text-xs mb-2">
        <thead>
          <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            <th className="text-left pb-1.5">Công ty</th>
            <th className="text-right pb-1.5 w-20">Thị phần</th>
            <th className="text-center pb-1.5 w-16">Của mình</th>
            <th className="pb-1.5 w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((entry, i) => (
            <MarketShareRow
              key={entry.id}
              entry={entry}
              color={PIE_COLORS[i % PIE_COLORS.length]}
              type={type}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>

      <button
        onClick={() => onAdd(type, { name: '', percentage: 0, isOwn: false })}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Plus size={12} /> Thêm công ty
      </button>
    </div>
  )
}

function MarketShareRow({ entry, color, type, onUpdate, onRemove }) {
  return (
    <tr className="group">
      <td className="py-1.5 pr-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <input
            value={entry.name}
            onChange={(e) => onUpdate(type, entry.id, { name: e.target.value })}
            className="w-full border-0 border-b border-transparent hover:border-slate-300 focus:border-blue-400 bg-transparent outline-none text-slate-700 text-xs py-0.5"
            placeholder="Tên công ty"
          />
        </div>
      </td>
      <td className="py-1.5 pr-2">
        <div className="flex items-center gap-1 justify-end">
          <input
            type="number" min="0" max="100" value={entry.percentage}
            onChange={(e) => onUpdate(type, entry.id, { percentage: Number(e.target.value) })}
            className="w-14 text-right border-0 border-b border-transparent hover:border-slate-300 focus:border-blue-400 bg-transparent outline-none text-slate-700 text-xs"
          />
          <span className="text-slate-400 text-xs">%</span>
        </div>
      </td>
      <td className="py-1.5 text-center">
        <input
          type="checkbox"
          checked={entry.isOwn}
          onChange={(e) => onUpdate(type, entry.id, { isOwn: e.target.checked })}
          className="rounded border-slate-300 text-blue-600 cursor-pointer"
        />
      </td>
      <td className="py-1.5">
        <button
          onClick={() => onRemove(type, entry.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
        >
          <Trash2 size={12} />
        </button>
      </td>
    </tr>
  )
}

// ────────────────────────────────────────────────────────────
// 4.3 Segments & Products section
// ────────────────────────────────────────────────────────────
function SegmentsSection() {
  const store = useAssessmentStore()

  const lists = [
    { field: 'currentSegments', label: 'Phân khúc hiện tại', placeholder: 'VD: SME ngành giáo dục' },
    { field: 'futureSegments', label: 'Phân khúc tương lai', placeholder: 'VD: Doanh nghiệp sản xuất vừa' },
    { field: 'currentProducts', label: 'Sản phẩm chủ lực hiện tại', placeholder: 'VD: Phần mềm BSC' },
    { field: 'futureProducts', label: 'Sản phẩm chủ lực tương lai', placeholder: 'VD: SaaS toàn diện' },
  ]

  return (
    <SectionCard icon={Layers} title="4.3 Phân khúc & Sản phẩm chủ lực" subtitle="Phân khúc khách hàng và nhóm sản phẩm theo giai đoạn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lists.map(({ field, label, placeholder }) => (
          <div key={field}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
            <DynamicTextList
              items={store[field]}
              onAdd={(v) => store.addListItem(field, v)}
              onUpdate={(id, v) => store.updateListItem(field, id, v)}
              onRemove={(id) => store.removeListItem(field, id)}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ────────────────────────────────────────────────────────────
// 4.4–4.8 Single-list sections
// ────────────────────────────────────────────────────────────
function SimpleListSection({ icon, iconColor, title, subtitle, field, placeholder }) {
  const store = useAssessmentStore()
  return (
    <SectionCard icon={icon} iconColor={iconColor} title={title} subtitle={subtitle}>
      <DynamicTextList
        items={store[field]}
        onAdd={(v) => store.addListItem(field, v)}
        onUpdate={(id, v) => store.updateListItem(field, id, v)}
        onRemove={(id) => store.removeListItem(field, id)}
        placeholder={placeholder}
      />
    </SectionCard>
  )
}

// ────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const { complete, fetch, loading } = useAssessmentStore()
  const { strategyId } = useBscContextStore()
  const navigate = useNavigate()
  const [errors, setErrors] = useState([])
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (strategyId) fetch(strategyId)
  }, [strategyId])

  const handleComplete = async () => {
    setCompleting(true)
    const errs = await complete()
    setCompleting(false)
    if (errs.length > 0) {
      setErrors(errs)
      toast.error(errs[0])
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    toast.success('Hoàn thành B1! Chuyển sang B2.')
    navigate('/strategy-build/swot')
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
        <p className="text-slate-400 text-sm">Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B1. Đánh giá Hiện trạng Doanh nghiệp</h1>
          <p className="text-sm text-slate-500 mt-1">Nhập thông tin tổng quan về tình hình hiện tại và định hướng tương lai trước khi xây dựng chiến lược BSC</p>
        </div>
        <button
          onClick={handleComplete}
          disabled={completing}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-blue-500/30 shrink-0"
        >
          {completing ? 'Đang lưu...' : 'Hoàn thành B1'}
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={15} className="text-red-600 shrink-0" />
            <span className="text-sm font-semibold text-red-700">Vui lòng kiểm tra lại trước khi hoàn thành</span>
          </div>
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-600 pl-5">• {err}</p>
          ))}
        </div>
      )}

      {/* 4.1 Tài chính */}
      <FinancialSection />

      {/* 4.2 Thị phần */}
      <MarketShareSection />

      {/* 4.3 Phân khúc & Sản phẩm */}
      <SegmentsSection />

      {/* 4.4 Điểm mạnh công ty */}
      <SimpleListSection
        icon={Star} iconColor="text-amber-600"
        title="4.4 Điểm mạnh công ty"
        subtitle="Các lợi thế nội bộ hiện tại của doanh nghiệp"
        field="companyStrengths"
        placeholder="VD: Đội ngũ kỹ thuật triển khai nhanh"
      />

      {/* 4.5 Yếu tố thành công trong ngành */}
      <SimpleListSection
        icon={Zap} iconColor="text-purple-600"
        title="4.5 Yếu tố thành công trong ngành"
        subtitle="Những điều quan trọng để thành công trong ngành đang hoạt động"
        field="industrySuccessFactors"
        placeholder="VD: Tốc độ triển khai nhanh"
      />

      {/* 4.6 Điểm mạnh đối thủ */}
      <SimpleListSection
        icon={Shield} iconColor="text-red-500"
        title="4.6 Điểm mạnh đối thủ"
        subtitle="Những lợi thế mà đối thủ cạnh tranh đang có"
        field="competitorStrengths"
        placeholder="VD: Đối thủ có thương hiệu mạnh"
      />

      {/* 4.7 Điểm yếu đối thủ */}
      <SimpleListSection
        icon={Target} iconColor="text-emerald-600"
        title="4.7 Điểm yếu đối thủ"
        subtitle="Những hạn chế của đối thủ mà doanh nghiệp có thể khai thác"
        field="competitorWeaknesses"
        placeholder="VD: Quy trình hỗ trợ khách hàng chậm"
      />

      {/* 4.8 Lợi thế cạnh tranh */}
      <SimpleListSection
        icon={TrendingUp} iconColor="text-blue-600"
        title="4.8 Lợi thế cạnh tranh của doanh nghiệp"
        subtitle="Những lợi thế doanh nghiệp có thể tận dụng so với đối thủ"
        field="competitiveAdvantages"
        placeholder="VD: Triển khai nhanh hơn đối thủ"
      />

      {/* Footer CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleComplete}
          disabled={completing}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-blue-500/30"
        >
          {completing ? 'Đang lưu...' : 'Hoàn thành B1 — Tiếp theo: Xây dựng chiến lược'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

