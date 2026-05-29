import { create } from 'zustand'
import { mockStrategicObjectives } from '../data/mockStrategicObjectives.js'
import { mockStrategicLinks } from '../data/mockStrategicLinks.js'

export const useStrategyStore = create(set => ({
  objectives: [...mockStrategicObjectives],
  links: [...mockStrategicLinks],
  selectedObjectiveId: null,

  selectObjective: (id) => set({ selectedObjectiveId: id }),
  clearSelection: () => set({ selectedObjectiveId: null }),

  updateObjectivePosition: (id, position) => set(s => ({
    objectives: s.objectives.map(o => o.id === id ? { ...o, position } : o),
  })),
}))
