import { create } from 'zustand'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

// Task statuses per doc spec
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED']

export const STATUS_META = {
  TODO:        { label: 'Chờ làm',      color: '#64748b', bg: '#f1f5f9' },
  IN_PROGRESS: { label: 'Đang làm',     color: '#2563eb', bg: '#dbeafe' },
  REVIEW:      { label: 'Đang xem xét', color: '#7c3aed', bg: '#ede9fe' },
  DONE:        { label: 'Hoàn thành',   color: '#16a34a', bg: '#dcfce7' },
  BLOCKED:     { label: 'Bị chặn',      color: '#dc2626', bg: '#fee2e2' },
  CANCELLED:   { label: 'Hủy bỏ',       color: '#9ca3af', bg: '#f3f4f6' },
}

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export const PRIORITY_META = {
  LOW:      { label: 'Thấp',     color: '#64748b' },
  MEDIUM:   { label: 'Trung bình', color: '#d97706' },
  HIGH:     { label: 'Cao',      color: '#ea580c' },
  CRITICAL: { label: 'Khẩn cấp', color: '#dc2626' },
}

// Shape:
//   actionPlans: [{ id, kpiId, name, description, ownerId, ownerName, startDate, endDate, priority, status }]
//   tasks: [{ id, actionPlanId, name, description, assigneeId, assigneeName, startDate, dueDate,
//             status, priority, progress, blockReason, reviewNote }]
//   kpiReports: [{ id, kpiId, reportedAt, actualValue, note, reporterId, reporterName }]

export const useActionPlanStore = create((set, get) => ({
  actionPlans: [],
  tasks: [],
  kpiReports: [],

  // ── Action Plans ──────────────────────────────────────────────
  addActionPlan: (data) => set((state) => ({
    actionPlans: [...state.actionPlans, {
      id: `ap-${uid()}`,
      kpiId: data.kpiId,
      name: data.name?.trim() ?? '',
      description: data.description?.trim() ?? '',
      ownerId: data.ownerId ?? '',
      ownerName: data.ownerName ?? '',
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      priority: data.priority ?? 'MEDIUM',
      status: 'TODO',
    }],
  })),

  updateActionPlan: (id, changes) => set((state) => ({
    actionPlans: state.actionPlans.map((ap) => ap.id === id ? { ...ap, ...changes } : ap),
  })),

  deleteActionPlan: (id) => set((state) => ({
    actionPlans: state.actionPlans.filter((ap) => ap.id !== id),
    tasks: state.tasks.filter((t) => t.actionPlanId !== id),
  })),

  // ── Tasks ─────────────────────────────────────────────────────
  addTask: (data) => set((state) => ({
    tasks: [...state.tasks, {
      id: `task-${uid()}`,
      actionPlanId: data.actionPlanId,
      name: data.name?.trim() ?? '',
      description: data.description?.trim() ?? '',
      assigneeId: data.assigneeId ?? '',
      assigneeName: data.assigneeName ?? '',
      startDate: data.startDate ?? '',
      dueDate: data.dueDate ?? '',
      status: 'TODO',
      priority: data.priority ?? 'MEDIUM',
      progress: 0,
      blockReason: '',
      reviewNote: '',
    }],
  })),

  updateTask: (id, changes) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...changes } : t),
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),

  setTaskStatus: (id, status, extra = {}) => set((state) => ({
    tasks: state.tasks.map((t) => {
      if (t.id !== id) return t
      const update = { ...t, status, ...extra }
      if (status === 'DONE') update.progress = 100
      if (status !== 'BLOCKED') update.blockReason = extra.blockReason ?? t.blockReason
      return update
    }),
  })),

  setTaskProgress: (id, progress) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, progress } : t),
  })),

  // ── KPI Reports ───────────────────────────────────────────────
  addKpiReport: (data) => set((state) => ({
    kpiReports: [...state.kpiReports, {
      id: `rpt-${uid()}`,
      kpiId: data.kpiId,
      reportedAt: data.reportedAt ?? new Date().toISOString().slice(0, 10),
      actualValue: data.actualValue,
      note: data.note?.trim() ?? '',
      reporterId: data.reporterId ?? '',
      reporterName: data.reporterName ?? '',
    }],
  })),

  deleteKpiReport: (id) => set((state) => ({
    kpiReports: state.kpiReports.filter((r) => r.id !== id),
  })),

  // ── Derived helpers ────────────────────────────────────────────
  getActionPlansForKpi: (kpiId) => get().actionPlans.filter((ap) => ap.kpiId === kpiId),
  getTasksForActionPlan: (apId) => get().tasks.filter((t) => t.actionPlanId === apId),
  getReportsForKpi: (kpiId) => get().kpiReports.filter((r) => r.kpiId === kpiId),
}))
