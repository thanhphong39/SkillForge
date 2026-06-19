import { create } from 'zustand'

// B7 measurement configuration per KPI
// config: { unit, baseline, target, direction, frequency, formula, thresholdGreen, thresholdYellow }
export const useKPIMeasureStore = create((set, get) => ({
  configs: {},

  setConfig: (kpiId, cfg) => set((s) => ({
    configs: { ...s.configs, [kpiId]: { ...s.configs[kpiId], ...cfg } },
  })),

  getConfig: (kpiId) => get().configs[kpiId] ?? null,

  isConfigured: (kpiId) => {
    const cfg = get().configs[kpiId]
    return !!(cfg?.unit && cfg?.target)
  },

  getConfiguredCount: (kpiIds) => {
    const { configs } = get()
    return kpiIds.filter((id) => configs[id]?.unit && configs[id]?.target).length
  },
}))
