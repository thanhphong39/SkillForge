import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Circle, Loader2, ChevronRight,
  Target, Flag, AlertTriangle, TrendingUp, Users, ArrowRight,
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

// ── Constants ─────────────────────────────────────────────────────────────────

const PERSPECTIVES = [
  { id: 'FINANCIAL',            label: 'Tài chính',            color: '#16a34a', bg: '#f0fdf4', icon: '💰' },
  { id: 'CUSTOMER',             label: 'Khách hàng',           color: '#2563eb', bg: '#eff6ff', icon: '👥' },
  { id: 'INTERNAL_PROCESS',     label: 'Quy trình nội bộ',     color: '#9333ea', bg: '#faf5ff', icon: '⚙️' },
  { id: 'LEARNING_AND_GROWTH',  label: 'Học hỏi & Phát triển', color: '#d97706', bg: '#fffbeb', icon: '🌱' },
]

const STEPS = [
  { id: 'B1', label: 'Đánh giá',           to: '/assessment' },
  { id: 'B2', label: 'Chiến lược',         to: '/strategy-build/swot' },
  { id: 'B3', label: 'Kết quả',            to: '/strategy-results/selection' },
  { id: 'B4', label: 'Bản đồ',            to: '/strategy-map/perspectives' },
  { id: 'B5', label: 'Xương cá',          to: '/fishbone' },
  { id: 'B6', label: 'Tỉ trọng',          to: '/weight-allocation' },
  { id: 'B7', label: 'Đo lường',          to: '/kpi-setup' },
  { id: 'B8', label: 'Action Plan',       to: '/action-plan' },
]

const TASK_STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED']

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon: Icon, to, navigate }) {
  return (
    <div
      className={clsx('bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4', to && 'cursor-pointer hover:shadow-md transition-shadow')}
      onClick={to ? () => navigate(to) : undefined}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '20' }}>
          <Icon size={20} style={{ color }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
        {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
      {to && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
    </div>
  )
}

function StepBadge({ status }) {
  if (status === 'completed') return <CheckCircle2 size={16} className="text-emerald-500" />
  if (status === 'active')    return <Loader2 size={16} className="text-blue-500 animate-spin" />
  return <Circle size={16} className="text-slate-300" />
}

function WorkflowTimeline({ steps, stepStatuses, navigate }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-800 mb-4">Tiến độ triển khai BSC</h2>
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const status = stepStatuses[step.id]?.status ?? 'pending'
          const isLast = i === steps.length - 1
          return (
            <div key={step.id} className="flex items-center shrink-0">
              <button
                onClick={() => navigate(step.to)}
                className={clsx(
                  'flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-colors group',
                  status === 'completed' ? 'hover:bg-emerald-50' :
                  status === 'active' ? 'hover:bg-blue-50' : 'hover:bg-slate-50'
                )}
              >
                <StepBadge status={status} />
                <span className={clsx(
                  'text-[10px] font-bold uppercase tracking-wide',
                  status === 'completed' ? 'text-emerald-600' :
                  status === 'active' ? 'text-blue-600' : 'text-slate-300'
                )}>
                  {step.id}
                </span>
                <span className={clsx(
                  'text-[10px] whitespace-nowrap',
                  status === 'completed' ? 'text-emerald-500' :
                  status === 'active' ? 'text-blue-500' : 'text-slate-400'
                )}>
                  {step.label}
                </span>
              </button>
              {!isLast && (
                <ArrowRight size={14} className={clsx(
                  'shrink-0',
                  status === 'completed' ? 'text-emerald-300' : 'text-slate-200'
                )} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PerspectiveCard({ p, objectives, kpis, weight, configuredKpis, tasks, actionPlans }) {
  const perspObjs = objectives.filter((o) => o.perspective === p.id)
  const perspKpis = kpis.filter((k) => k.perspective === p.id)
  const perspKpiIds = new Set(perspKpis.map((k) => k.id))

  const perspAPs = actionPlans.filter((ap) => perspKpiIds.has(ap.kpiId))
  const perspAPIds = new Set(perspAPs.map((ap) => ap.id))
  const perspTasks = tasks.filter((t) => perspAPIds.has(t.actionPlanId))
  const doneTasks = perspTasks.filter((t) => t.status === 'DONE').length
  const configuredCount = perspKpis.filter((k) => configuredKpis.has(k.id)).length

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-1 w-full" style={{ background: p.color }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{p.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-800">{p.label}</div>
          </div>
          {weight > 0 && (
            <div className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: p.color + '20', color: p.color }}>
              {weight}%
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { val: perspObjs.length,   label: 'Mục tiêu' },
            { val: perspKpis.length,   label: 'KPI' },
            { val: perspTasks.length,  label: 'Tasks' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center p-2 rounded-lg" style={{ background: p.color + '10' }}>
              <div className="text-base font-bold" style={{ color: p.color }}>{val}</div>
              <div className="text-[10px] text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {perspKpis.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>KPI được cấu hình B7</span>
              <span>{configuredCount}/{perspKpis.length}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${perspKpis.length > 0 ? (configuredCount / perspKpis.length) * 100 : 0}%`, background: p.color }}
              />
            </div>
          </div>
        )}

        {perspTasks.length > 0 && (
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Tasks hoàn thành</span>
              <span>{doneTasks}/{perspTasks.length}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${perspTasks.length > 0 ? (doneTasks / perspTasks.length) * 100 : 0}%`, background: p.color }}
              />
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

function WeightDonut({ perspectiveWeights }) {
  const data = PERSPECTIVES.map((p) => ({
    name: p.label,
    value: perspectiveWeights[p.id] ?? 0,
    color: p.color,
  })).filter((d) => d.value > 0)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-slate-800 text-white rounded-xl px-3 py-2 text-xs shadow-xl">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-blue-300">{payload[0].value}%</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-800 mb-1">Phân bổ Tỉ trọng (B6)</h2>
      <p className="text-[11px] text-slate-400 mb-3">Tỉ trọng tuyệt đối 4 góc độ BSC</p>
      {data.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">Chưa cấu hình tỉ trọng (B6)</p>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function TaskStatusChart({ tasks }) {
  const data = TASK_STATUS_ORDER.map((s) => ({
    name: STATUS_META[s].label,
    count: tasks.filter((t) => t.status === s).length,
    color: STATUS_META[s].color,
  })).filter((d) => d.count > 0)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-800 mb-1">Trạng thái Tasks (B8)</h2>
      <p className="text-[11px] text-slate-400 mb-3">Phân bổ tổng {tasks.length} task</p>
      {tasks.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">Chưa có task nào (B8)</p>
      ) : (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip
                formatter={(v, n) => [v, 'Tasks']}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
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

function DeptParticipation({ departments, objectives, kpis }) {
  if (objectives.length === 0) return null
  const rows = departments.map((dept) => {
    const deptKpis = kpis.filter((k) => k.deptId === dept.id)
    const objIds = new Set(deptKpis.map((k) => k.objectiveId))
    return { dept, kpiCount: deptKpis.length, objCount: objIds.size }
  }).filter((r) => r.kpiCount > 0)

  if (rows.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-800 mb-3">Tham gia phòng ban (B5)</h2>
      <div className="space-y-2.5">
        {rows.map(({ dept, kpiCount, objCount }) => (
          <div key={dept.id} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dept.color }} />
            <span className="text-xs text-slate-600 flex-1 truncate">{dept.name}</span>
            <span className="text-[10px] text-slate-400 shrink-0">{objCount} mục tiêu</span>
            <span className="text-xs font-bold shrink-0" style={{ color: dept.color }}>{kpiCount} KPI</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiReportsFeed({ kpiReports, allKpis }) {
  const recent = [...kpiReports]
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))
    .slice(0, 8)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-800 mb-3">Báo cáo KPI gần đây (B8)</h2>
      {recent.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">Chưa có báo cáo giá trị thực tế</p>
      ) : (
        <div className="space-y-2">
          {recent.map((r) => {
            const kpi = allKpis.find((k) => k.id === r.kpiId)
            return (
              <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: kpi?.deptColor ?? '#64748b' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{kpi?.name ?? r.kpiId}</p>
                  {r.note && <p className="text-[10px] text-slate-400 truncate">{r.note}</p>}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-800">{r.actualValue}</div>
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

function BlockedTasksAlert({ tasks, actionPlans, allKpis }) {
  const blocked = tasks.filter((t) => t.status === 'BLOCKED')
  if (blocked.length === 0) return null
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={15} className="text-red-600 shrink-0" />
        <h2 className="text-sm font-bold text-red-700">{blocked.length} task đang bị chặn (BLOCKED)</h2>
      </div>
      <div className="space-y-2">
        {blocked.slice(0, 4).map((t) => {
          const ap = actionPlans.find((a) => a.id === t.actionPlanId)
          const kpi = allKpis.find((k) => k.id === ap?.kpiId)
          return (
            <div key={t.id} className="flex items-start gap-2 bg-white rounded-xl px-3 py-2.5 border border-red-100">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{t.name}</p>
                {kpi && <p className="text-[10px] text-red-500">KPI: {kpi.name}</p>}
                {t.blockReason && <p className="text-[10px] text-red-600 mt-0.5">🚫 {t.blockReason}</p>}
              </div>
              {t.assigneeName && (
                <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                  <Users size={9} /> {t.assigneeName.split(' ').slice(-1)}
                </span>
              )}
            </div>
          )
        })}
        {blocked.length > 4 && (
          <p className="text-xs text-red-500 text-center">+{blocked.length - 4} task khác</p>
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
  const { perspectiveWeights, objectiveWeights, kpiWeights } = useWeightStore()
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
  const totalWeight = Object.values(perspectiveWeights).reduce((a, b) => a + b, 0)
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED').length

  // Build quick action: next incomplete step
  const nextStep = STEPS.find((s) => {
    const status = steps[s.id]?.status
    return status === 'active' || status === 'pending'
  })

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan BSC</h1>
          <p className="text-sm text-slate-500 mt-1">
            SkillForge · {completedCount}/8 bước hoàn thành
            {nextStep && <span className="ml-2 text-blue-500">· Tiếp theo: {nextStep.id} {nextStep.label}</span>}
          </p>
        </div>
        {nextStep && (
          <button
            onClick={() => navigate(nextStep.to)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Tiếp tục {nextStep.id} <ChevronRight size={15} />
          </button>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Mục tiêu chiến lược (B4)"
          value={objectives.length}
          sub={`${b3Selected.length} chiến lược đã chọn`}
          color="#9333ea"
          icon={Target}
          to="/strategy-map/perspectives"
          navigate={navigate}
        />
        <StatCard
          label="KPI đã xây dựng (B5)"
          value={allKpis.length}
          sub={`${configuredKpiIds.size}/${allKpis.length} đã cấu hình B7`}
          color="#2563eb"
          icon={TrendingUp}
          to="/kpi-setup"
          navigate={navigate}
        />
        <StatCard
          label="Kế hoạch hành động (B8)"
          value={actionPlans.length}
          sub={`${tasks.length} tasks · ${tasks.filter((t) => t.status === 'DONE').length} hoàn thành`}
          color="#16a34a"
          icon={Flag}
          to="/action-plan"
          navigate={navigate}
        />
        <StatCard
          label="Tasks bị chặn"
          value={blockedTasks}
          sub={blockedTasks > 0 ? 'Cần xử lý ngay' : 'Không có vấn đề'}
          color={blockedTasks > 0 ? '#dc2626' : '#16a34a'}
          icon={AlertTriangle}
          to="/action-plan"
          navigate={navigate}
        />
      </div>

      {/* BSC Workflow Timeline */}
      <WorkflowTimeline steps={STEPS} stepStatuses={steps} navigate={navigate} />

      {/* Blocked tasks alert */}
      {blockedTasks > 0 && (
        <BlockedTasksAlert tasks={tasks} actionPlans={actionPlans} allKpis={allKpis} />
      )}

      {/* Perspective cards + Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: 4 perspective cards */}
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Right: Weight donut + Task status */}
        <div className="space-y-4">
          <WeightDonut perspectiveWeights={perspectiveWeights} />
          <TaskStatusChart tasks={tasks} />
        </div>
      </div>

      {/* Bottom row: Dept participation + KPI reports feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="space-y-4">
          <DeptParticipation departments={departments} objectives={objectives} kpis={allKpis} />
          {objectives.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <p className="text-sm text-slate-400 mb-3">Chưa có dữ liệu. Hãy hoàn thành các bước B4–B8 để xem tổng quan.</p>
              <button
                onClick={() => navigate(nextStep?.to ?? '/strategy-map/perspectives')}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Bắt đầu từ {nextStep?.id ?? 'B4'} →
              </button>
            </div>
          )}
        </div>
        <KpiReportsFeed kpiReports={kpiReports} allKpis={allKpis} />
      </div>
    </div>
  )
}
