import { create } from 'zustand'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

export const MOCK_DEPARTMENTS = [
  { id: 'dept-hr',      name: 'Nhân sự (HR)',         color: '#8b5cf6' },
  { id: 'dept-sales',   name: 'Kinh doanh (Sales)',   color: '#10b981' },
  { id: 'dept-mkt',     name: 'Marketing',            color: '#f59e0b' },
  { id: 'dept-product', name: 'Sản phẩm (Product)',   color: '#3b82f6' },
  { id: 'dept-ops',     name: 'Vận hành (Ops)',       color: '#ef4444' },
  { id: 'dept-it',      name: 'IT',                   color: '#0891b2' },
]

export const useFishboneStore = create((set, get) => ({
  departments: MOCK_DEPARTMENTS,
  // Simulated current view: 'ceo' or dept ID
  viewAs: 'ceo',
  currentDeptId: MOCK_DEPARTMENTS[0].id,

  // participations[deptId][objectiveId] = true | false
  participations: {},

  // deptKPIs[deptId][objectiveId] = [{id, name, description}]
  deptKPIs: {},

  setViewAs: (val) => set({ viewAs: val }),
  setCurrentDept: (deptId) => set({ currentDeptId: deptId }),

  // Toggle a department's participation in an objective
  toggleParticipation: (deptId, objectiveId) => set((state) => {
    const deptPart = state.participations[deptId] ?? {}
    const current = !!deptPart[objectiveId]
    return {
      participations: {
        ...state.participations,
        [deptId]: { ...deptPart, [objectiveId]: !current },
      },
    }
  }),

  isParticipating: (deptId, objectiveId) => {
    const { participations } = get()
    return !!(participations[deptId] ?? {})[objectiveId]
  },

  addKPI: (deptId, objectiveId, name, description = '') => set((state) => {
    const deptKPI = state.deptKPIs[deptId] ?? {}
    const existing = deptKPI[objectiveId] ?? []
    const newKPI = { id: uid(), name: name.trim(), description: description.trim() }
    return {
      deptKPIs: {
        ...state.deptKPIs,
        [deptId]: { ...deptKPI, [objectiveId]: [...existing, newKPI] },
      },
    }
  }),

  updateKPI: (deptId, objectiveId, kpiId, updates) => set((state) => {
    const deptKPI = state.deptKPIs[deptId] ?? {}
    const existing = deptKPI[objectiveId] ?? []
    return {
      deptKPIs: {
        ...state.deptKPIs,
        [deptId]: {
          ...deptKPI,
          [objectiveId]: existing.map((k) => (k.id === kpiId ? { ...k, ...updates } : k)),
        },
      },
    }
  }),

  removeKPI: (deptId, objectiveId, kpiId) => set((state) => {
    const deptKPI = state.deptKPIs[deptId] ?? {}
    const existing = deptKPI[objectiveId] ?? []
    return {
      deptKPIs: {
        ...state.deptKPIs,
        [deptId]: { ...deptKPI, [objectiveId]: existing.filter((k) => k.id !== kpiId) },
      },
    }
  }),

  // Get all KPIs for an objective across all depts
  getObjectiveKPIs: (objectiveId) => {
    const { departments, deptKPIs, participations } = get()
    return departments
      .filter((d) => !!(participations[d.id] ?? {})[objectiveId])
      .flatMap((d) =>
        (deptKPIs[d.id]?.[objectiveId] ?? []).map((k) => ({ ...k, deptId: d.id, deptName: d.name, deptColor: d.color }))
      )
  },

  // All KPIs for a department (flat)
  getDeptAllKPIs: (deptId) => {
    const { deptKPIs } = get()
    const deptMap = deptKPIs[deptId] ?? {}
    return Object.entries(deptMap).flatMap(([objectiveId, kpis]) =>
      kpis.map((k) => ({ ...k, objectiveId }))
    )
  },

  // All KPIs flat (for B6/B7 consumption)
  getAllKPIs: (objectives) => {
    const { departments, deptKPIs, participations } = get()
    return (objectives ?? []).flatMap((obj) =>
      departments
        .filter((d) => !!(participations[d.id] ?? {})[obj.id])
        .flatMap((d) =>
          (deptKPIs[d.id]?.[obj.id] ?? []).map((k) => ({
            ...k,
            objectiveId: obj.id,
            objectiveName: obj.name,
            perspective: obj.perspective,
            deptId: d.id,
            deptName: d.name,
            deptColor: d.color,
          }))
        )
    )
  },

  validate: (objectives) => {
    const state = get()
    const errors = []
    ;(objectives ?? []).forEach((obj) => {
      const depts = state.departments.filter((d) => !!(state.participations[d.id] ?? {})[obj.id])
      if (depts.length === 0) errors.push(`Mục tiêu "${obj.name}" chưa có phòng ban nào tham gia`)
      depts.forEach((d) => {
        const kpis = (state.deptKPIs[d.id]?.[obj.id] ?? []).filter((k) => k.name.trim())
        if (kpis.length === 0) errors.push(`${d.name} tham gia "${obj.name}" nhưng chưa tạo KPI`)
      })
    })
    return errors
  },
}))
