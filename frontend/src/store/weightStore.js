import { create } from 'zustand'

const DEFAULT_PERSPECTIVE_WEIGHTS = {
  FINANCIAL: 40,
  CUSTOMER: 30,
  INTERNAL_PROCESS: 20,
  LEARNING_AND_GROWTH: 10,
}

export const useWeightStore = create((set, get) => ({
  perspectiveWeights: { ...DEFAULT_PERSPECTIVE_WEIGHTS },
  objectiveWeights: {}, // { [objId]: absoluteWeight }
  kpiWeights: {},       // { [kpiId]: absoluteWeight }

  setPerspectiveWeight: (perspId, value) => set((state) => ({
    perspectiveWeights: {
      ...state.perspectiveWeights,
      [perspId]: Math.max(0, Math.min(100, Number(value) || 0)),
    },
  })),

  setObjectiveWeight: (objId, value) => set((state) => ({
    objectiveWeights: {
      ...state.objectiveWeights,
      [objId]: Math.max(0, Number(value) || 0),
    },
  })),

  setKpiWeight: (kpiId, value) => set((state) => ({
    kpiWeights: {
      ...state.kpiWeights,
      [kpiId]: Math.max(0, Number(value) || 0),
    },
  })),

  // Evenly distribute perspective weight across uninitialized objectives
  initObjectiveWeights: (objectives) => set((state) => {
    const weights = { ...state.objectiveWeights }
    const perspWt = state.perspectiveWeights
    const byPersp = {}
    objectives.forEach((o) => {
      if (!byPersp[o.perspective]) byPersp[o.perspective] = []
      byPersp[o.perspective].push(o)
    })
    Object.entries(byPersp).forEach(([perspId, objs]) => {
      const uninit = objs.filter((o) => weights[o.id] === undefined)
      if (uninit.length === 0) return
      const target = perspWt[perspId] ?? 0
      const n = objs.length
      const share = Math.floor(target / n)
      let remaining = target - share * (n - uninit.length)
      uninit.forEach((o, i) => {
        weights[o.id] = i === uninit.length - 1 ? remaining : share
        if (i < uninit.length - 1) remaining -= share
      })
    })
    return { objectiveWeights: weights }
  }),

  // Evenly distribute objective weight across uninitialized KPIs
  initKpiWeights: (allKpis) => set((state) => {
    const weights = { ...state.kpiWeights }
    const objWt = state.objectiveWeights
    const byObj = {}
    allKpis.forEach((k) => {
      if (!byObj[k.objectiveId]) byObj[k.objectiveId] = []
      byObj[k.objectiveId].push(k)
    })
    Object.entries(byObj).forEach(([objId, kpis]) => {
      const uninit = kpis.filter((k) => weights[k.id] === undefined)
      if (uninit.length === 0) return
      const target = objWt[objId] ?? 0
      const n = kpis.length
      const share = Math.floor(target / n)
      let remaining = target - share * (n - uninit.length)
      uninit.forEach((k, i) => {
        weights[k.id] = i === uninit.length - 1 ? remaining : share
        if (i < uninit.length - 1) remaining -= share
      })
    })
    return { kpiWeights: weights }
  }),

  resetToDefault: () => set({
    perspectiveWeights: { ...DEFAULT_PERSPECTIVE_WEIGHTS },
    objectiveWeights: {},
    kpiWeights: {},
  }),
}))
