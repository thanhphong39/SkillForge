import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Circle, Loader2, ChevronRight,
  Target, Flag, AlertTriangle, TrendingUp, Users,
  ArrowUpRight, ArrowDownRight, BarChart3, Activity,
  Layers, ListTodo,
} from 'lucide-react'
import clsx from 'clsx'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useSWOTStore } from '../../store/swotStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useWeightStore } from '../../store/weightStore.js'
import { useActionPlanStore, STATUS_META } from '../../store/actionPlanStore.js'
import { useKPIMeasureStore } from '../../store/kpiMeasureStore.js'

const PERSPECTIVES = [
  { id: 'FINANCIAL',           label: 'Tài chính',            color: '#16a34a', light: '#f0fdf4', icon: '💰' },
  { id: 'CUSTOMER',            label: 'Khách hàng',           color: '#3C50E0', light: '#eef2ff', icon: '👥' },
  { id: 'INTERNAL_PROCESS',    label: 'Quy trình nội bộ',     color: '#9333ea', light: '#faf5ff', icon: '⚙️' },
  { id: 'LEARNING_AND_GROWTH', label: 'Học hỏi & Phát triển', color: '#d97706', light: '#fffbeb', icon: '🌱' },
]

const STEPS = [
  { id: 'B1', label: 'Đánh giá',    to: '/assessment' },
  { id: 'B2', label: 'Chiến lược',  to: '/strategy-build/swot' },
  { id: 'B3', label: 'Kết quả',     to: '/strategy-results/selection' },
  { id: 'B4', label: 'Bản đồ',      to: '/strategy-map/perspectives' },
  { id: 'B5', label: 'Xương cá',    to: '/fishbone' },
  { id: 'B6', label: 'Tỉ trọng',    to: '/weight-allocation' },
  { id: 'B7', label: 'Đo lường',    to: '/kpi-setup' },
  { id: 'B8', label: 'Action Plan', to: '/action-plan' },
]

const TASK_STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED']

// ── Stat Card (TailAdmin style) ───────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon: Icon, trend, trendUp, to, navigate }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4 card-hover',
        to && 'cursor-pointer'
      )}
      onClick={to ? () => navigate(to) : undefined}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + '18' }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-[#1C2434] leading-none mb-2">{value}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {trend !== undefined && (
            <span className={clsx(
              'inline-flex items-center gap-0.5 text-xs font-semibold',
              trendUp ? 'text-emerald-600' : 'text-red-500'
            )}>
              {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {trend}
            </span>
          )}
          {sub && <span className="text-xs text-slate-400">{sub}</span>}
        </div>
      </div>
      {to && <ChevronRight size={16} className="text-slate-300 shrink-0 mt-1" />}
    </div>
  )
}

// ── BSC Workflow Timeline ─────────────────────────────────────────────────────

function WorkflowTimeline({ steps, stepStatuses, navigate }) {
  const completed = Object.values(stepStatuses).filter((s) => s?.status === 'completed').length

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#1C2434]">Tiến độ triển khai BSC</h2>
          <p className="text-xs text-slate-400 mt-0.5">{completed} / {steps.length} bước hoàn thành</p>
        </div>
        <span className="text-sm font-bold text-[#3C50E0]">
          {Math.round((completed / steps.length) * 100)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-[#3C50E0] rounded-full transition-all duration-500"
          style={{ width: `${(completed / steps.length) * 100}%` }}
        />
      </div>

      {/* Step list */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {steps.map((step) => {
          const status = stepStatuses[step.id]?.status ?? 'pending'
          return (
            <button
              key={step.id}
              onClick={() => navigate(step.to)}
              className={clsx(
                'flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all group text-center',
                status === 'completed' ? 'hover:bg-emerald-50' :
                status === 'active'    ? 'hover:bg-blue-50' : 'hover:bg-slate-50'
              )}
            >
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                status === 'active'    ? 'bg-[#3C50E0] border-[#3C50E0]' :
                'bg-white border-slate-200'
              )}>
                {status === 'completed' ? (
                  <CheckCircle2 size={14} className="text-white" />
                ) : status === 'active' ? (
                  <Loader2 size={13} className="text-white animate-spin" />
                ) : (
                  <Circle size={13} className="text-slate-300" />
                )}
              </div>
              <span className={clsx(
                'text-[10px] font-bold uppercase',
                status === 'completed' ? 'text-emerald-600' :
                status === 'active'    ? 'text-[#3C50E0]' : 'text-slate-300'
              )}>
                {step.id}
              </span>
              <span className={clsx(
                'text-[9px] leading-tight',
                status === 'completed' ? 'text-emerald-500' :
                status === 'active'    ? 'text-blue-500' : 'text-slate-400'
              )}>
                {step.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Perspective Cards ─────────────────────────────────────────────────────────

function PerspectiveCard({ p, objectives, kpis, weight, configuredKpis, tasks, actionPlans }) {
  const perspObjs = objectives.filter((o) => o.perspective === p.id)
  const perspKpis = kpis.filter((k) => k.perspective === p.id)
  const perspKpiIds = new Set(perspKpis.map((k) => k.id))
  const perspAPs = actionPlans.filter((ap) => perspKpiIds.has(ap.kpiId))
  const perspAPIds = new Set(perspAPs.map((ap) => ap.id))
  const perspTasks = tasks.filter((t) => perspAPIds.has(t.actionPlanId))
  const doneTasks = perspTasks.filter((t) => t.status === 'DONE').length
  const configuredCount = perspKpis.filter((k) => configuredKpis.has(k.id)).length
  const taskPct = perspTasks.length > 0 ? Math.round((doneTasks / perspTasks.length) * 100) : 0
  const kpiPct = perspKpis.length > 0 ? Math.round((configuredCount / perspKpis.length) * 100) : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      <div className="h-1 w-full" style={{ background: p.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base" style={{ background: p.light }}>
              {p.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C2434]">{p.label}</h3>
              <p className="text-[11px] text-slate-400">Góc độ BSC</p>
            </div>
          </div>
          {weight > 0 && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: p.color + '15', color: p.color }}
            >
              {weight}%
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { val: perspObjs.length,  label: 'Mục tiêu' },
            { val: perspKpis.length,  label: 'KPI' },
            { val: perspTasks.length, label: 'Tasks' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center py-2.5 rounded-lg" style={{ background: p.light }}>
              <div className="text-lg font-bold leading-none mb-0.5" style={{ color: p.color }}>{val}</div>
              <div className="text-[10px] text-slate-500 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {perspKpis.length > 0 && (
          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>KPI cấu hình (B7)</span>
              <span className="font-semibold" style={{ color: p.color }}>{kpiPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${kpiPct}%`, background: p.color }} />
            </div>
          </div>
        )}

        {perspTasks.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Tasks hoàn thành</span>
              <span className="font-semibold" style={{ color: p.color }}>{taskPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${taskPct}%`, background: p.color }} />
            </div>
          </div>
        )}

        {perspObjs.length === 0 && perspKpis.length === 0 && (
          <p className="text-[11px] text-slate-300 text-center py-2">Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  )
}

// ── Weight Donut ──────────────────────────────────────────────────────────────

function WeightDonut({ perspectiveWeights }) {
  const data = PERSPECTIVES.map((p) => ({
    name: p.label, value: perspectiveWeights[p.id] ?? 0, color: p.color,
  })).filter((d) => d.value > 0)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#1C2434] text-white rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-[#3C50E0] font-bold mt-0.5">{payload[0].value}%</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-[#1C2434]">Phân bổ Tỉ trọng</h2>
        <p className="text-xs text-slate-400 mt-0.5">Tỉ trọng 4 góc độ BSC (B6)</p>
      </div>
      {data.length === 0 ? (
        <div className="py-10 text-center">
          <BarChart3 size={32} className="mx-auto mb-2 text-slate-200" />
          <p className="text-xs text-slate-400">Chưa cấu hình tỉ trọng (B6)</p>
        </div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ── Task Status Chart ─────────────────────────────────────────────────────────

function TaskStatusChart({ tasks }) {
  const data = TASK_STATUS_ORDER.map((s) => ({
    name: STATUS_META[s].label,
    count: tasks.filter((t) => t.status === s).length,
    color: STATUS_META[s].color,
  })).filter((d) => d.count > 0)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-[#1C2434]">Trạng thái Tasks</h2>
        <p className="text-xs text-slate-400 mt-0.5">{tasks.length} tasks tổng cộng (B8)</p>
      </div>
      {tasks.length === 0 ? (
        <div className="py-8 text-center">
          <ListTodo size={32} className="mx-auto mb-2 text-slate-200" />
          <p className="text-xs text-slate-400">Chưa có task nào</p>
        </div>
      ) : (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip
                formatter={(v) => [v, 'Tasks']}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ── Dept Participation ────────────────────────────────────────────────────────

function DeptParticipation({ departments, objectives, kpis }) {
  const rows = departments.map((dept) => {
    const deptKpis = kpis.filter((k) => k.deptId === dept.id)
    const objIds = new Set(deptKpis.map((k) => k.objectiveId))
    return { dept, kpiCount: deptKpis.length, objCount: objIds.size }
  }).filter((r) => r.kpiCount > 0)

  if (rows.length === 0 || objectives.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-[#1C2434]">Tham gia phòng ban</h2>
        <p className="text-xs text-slate-400 mt-0.5">KPI theo từng phòng ban (B5)</p>
      </div>
      <div className="space-y-3">
        {rows.map(({ dept, kpiCount, objCount }) => {
          const maxKpi = Math.max(...rows.map((r) => r.kpiCount), 1)
          const pct = Math.round((kpiCount / maxKpi) * 100)
          return (
            <div key={dept.id}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dept.color }} />
                <span className="text-xs text-slate-700 font-medium flex-1 truncate">{dept.name}</span>
                <span className="text-[10px] text-slate-400">{objCount} mục tiêu</span>
                <span className="text-xs font-bold shrink-0" style={{ color: dept.color }}>{kpiCount} KPI</span>
              </div>
              <div className="ml-5 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: dept.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── KPI Reports Feed ──────────────────────────────────────────────────────────

function KpiReportsFeed({ kpiReports, allKpis }) {
  const recent = [...kpiReports]
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))
    .slice(0, 8)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[#1C2434]">Báo cáo KPI gần đây</h2>
          <p className="text-xs text-slate-400 mt-0.5">Giá trị thực tế mới nhất (B8)</p>
        </div>
        <Activity size={16} className="text-slate-300" />
      </div>
      {recent.length === 0 ? (
        <div className="py-10 text-center">
          <Activity size={32} className="mx-auto mb-2 text-slate-200" />
          <p className="text-xs text-slate-400">Chưa có báo cáo giá trị thực tế</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((r) => {
            const kpi = allKpis.find((k) => k.id === r.kpiId)
            return (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: kpi?.deptColor ?? '#64748b' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{kpi?.name ?? r.kpiId}</p>
                  {r.note && <p className="text-[10px] text-slate-400 truncate">{r.note}</p>}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#1C2434]">{r.actualValue}</div>
                  <div className="text-[10px] text-slate-400">{r.reportedAt}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Blocked Tasks Alert ───────────────────────────────────────────────────────

function BlockedTasksAlert({ tasks, actionPlans, allKpis, navigate }) {
  const blocked = tasks.filter((t) => t.status === 'BLOCKED')
  if (blocked.length === 0) return null
  return (
    <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border-b border-red-100">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle size={14} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-red-700">{blocked.length} task đang bị chặn (BLOCKED)</h3>
          <p className="text-[11px] text-red-500">Cần xử lý để tiếp tục tiến độ</p>
        </div>
        <button
          onClick={() => navigate('/action-plan')}
          className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
        >
          Xem tất cả <ChevronRight size={12} />
        </button>
      </div>
      <div className="p-4 space-y-2">
        {blocked.slice(0, 3).map((t) => {
          const ap = actionPlans.find((a) => a.id === t.actionPlanId)
          const kpi = allKpis.find((k) => k.id === ap?.kpiId)
          return (
            <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/50">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{t.name}</p>
                {kpi && <p className="text-[10px] text-slate-500 mt-0.5">KPI: {kpi.name}</p>}
                {t.blockReason && <p className="text-[10px] text-red-600 mt-0.5">{t.blockReason}</p>}
              </div>
              {t.assigneeName && (
                <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5 mt-0.5">
                  <Users size={9} /> {t.assigneeName.split(' ').slice(-1)}
                </span>
              )}
            </div>
          )
        })}
        {blocked.length > 3 && (
          <p className="text-xs text-red-500 text-center pt-1">+{blocked.length - 3} task khác bị chặn</p>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate()
  const { steps } = useBSCWorkflowStore()
  const { b3Selected } = useSWOTStore()
  const strategyMapStore = useStrategyMapStore()
  const fishboneStore = useFishboneStore()
  const { perspectiveWeights } = useWeightStore()
  const { actionPlans, tasks, kpiReports } = useActionPlanStore()
  const measureStore = useKPIMeasureStore()

  const objectives = strategyMapStore.getEffectiveFinalObjectives(b3Selected)
  const allKpis = fishboneStore.getAllKPIs(objectives)
  const departments = fishboneStore.departments

  const configuredKpiIds = useMemo(
    () => new Set(allKpis.filter((k) => measureStore.isConfigured(k.id)).map((k) => k.id)),
    [allKpis, measureStore]
  )

  const completedCount = Object.values(steps).filter((s) => s.status === 'completed').length
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED').length
  const doneTasks = tasks.filter((t) => t.status === 'DONE').length

  const nextStep = STEPS.find((s) => {
    const status = steps[s.id]?.status
    return status === 'active' || status === 'pending'
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2434]">Tổng quan BSC</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {completedCount}/8 bước hoàn thành
            {nextStep && (
              <span className="ml-2 text-[#3C50E0] font-medium">
                · Tiếp theo: {nextStep.id} {nextStep.label}
              </span>
            )}
          </p>
        </div>
        {nextStep && (
          <button
            onClick={() => navigate(nextStep.to)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3C50E0] hover:bg-[#3142C4] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Tiếp tục {nextStep.id} <ChevronRight size={15} />
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Mục tiêu chiến lược"
          value={objectives.length}
          sub={`${b3Selected.length} chiến lược đã chọn`}
          color="#9333ea"
          icon={Target}
          to="/strategy-map/perspectives"
          navigate={navigate}
        />
        <StatCard
          label="KPI đã xây dựng"
          value={allKpis.length}
          sub={`${configuredKpiIds.size}/${allKpis.length} đã cấu hình B7`}
          color="#3C50E0"
          icon={TrendingUp}
          trend={allKpis.length > 0 ? `${Math.round((configuredKpiIds.size / allKpis.length) * 100)}% hoàn thành` : undefined}
          trendUp={configuredKpiIds.size === allKpis.length && allKpis.length > 0}
          to="/kpi-setup"
          navigate={navigate}
        />
        <StatCard
          label="Kế hoạch hành động"
          value={actionPlans.length}
          sub={`${tasks.length} tasks`}
          color="#16a34a"
          icon={Flag}
          trend={tasks.length > 0 ? `${Math.round((doneTasks / tasks.length) * 100)}% hoàn thành` : undefined}
          trendUp
          to="/action-plan"
          navigate={navigate}
        />
        <StatCard
          label="Tasks bị chặn"
          value={blockedTasks}
          sub={blockedTasks > 0 ? 'Cần xử lý ngay' : 'Không có vấn đề'}
          color={blockedTasks > 0 ? '#dc2626' : '#16a34a'}
          icon={AlertTriangle}
          trend={blockedTasks > 0 ? 'Cần xử lý' : 'Tốt'}
          trendUp={blockedTasks === 0}
          to="/action-plan"
          navigate={navigate}
        />
      </div>

      {/* BSC Timeline */}
      <WorkflowTimeline steps={STEPS} stepStatuses={steps} navigate={navigate} />

      {/* Blocked tasks alert */}
      {blockedTasks > 0 && (
        <BlockedTasksAlert tasks={tasks} actionPlans={actionPlans} allKpis={allKpis} navigate={navigate} />
      )}

      {/* Perspectives + Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PERSPECTIVES.map((p) => (
            <PerspectiveCard
              key={p.id}
              p={p}
              objectives={objectives}
              kpis={allKpis}
              weight={perspectiveWeights[p.id] ?? 0}
              configuredKpis={configuredKpiIds}
              tasks={tasks}
              actionPlans={actionPlans}
            />
          ))}
        </div>
        <div className="space-y-5">
          <WeightDonut perspectiveWeights={perspectiveWeights} />
          <TaskStatusChart tasks={tasks} />
        </div>
      </div>

      {/* Bottom: Dept + KPI feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-6">
        <div className="space-y-5">
          <DeptParticipation departments={departments} objectives={objectives} kpis={allKpis} />
          {objectives.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <Layers size={36} className="mx-auto mb-3 text-slate-200" />
              <p className="text-sm text-slate-500 mb-4">
                Chưa có dữ liệu. Hãy hoàn thành các bước B1–B8 để xem tổng quan đầy đủ.
              </p>
              <button
                onClick={() => navigate(nextStep?.to ?? '/strategy-map/perspectives')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3C50E0] text-white text-sm font-semibold rounded-lg hover:bg-[#3142C4] transition-colors"
              >
                Bắt đầu từ {nextStep?.id ?? 'B1'} <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
        <KpiReportsFeed kpiReports={kpiReports} allKpis={allKpis} />
      </div>

    </div>
  )
}
