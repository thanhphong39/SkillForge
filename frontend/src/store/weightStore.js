import { create } from 'zustand'
import { mockPerspectiveWeights, mockObjectiveWeights } from '../data/mockWeights.js'

const PERSPECTIVES = ['financial', 'customer', 'internal', 'learning']

function renormalize(weights, changedId, newValue) {
  const others = PERSPECTIVES.filter((k) => k !== changedId)
  const remaining = 100 - newValue
  const currentOthersTotal = others.reduce((sum, k) => sum + weights[k], 0)
  const result = { ...weights, [changedId]: newValue }
  if (currentOthersTotal === 0) {
    const share = Math.floor(remaining / others.length)
    others.forEach((k, i) => { result[k] = i === others.length - 1 ? remaining - share * (others.length - 1) : share })
  } else {
    others.forEach((k) => { result[k] = Math.round((weights[k] / currentOthersTotal) * remaining) })
    // Fix rounding errors
    const total = Object.values(result).reduce((a, b) => a + b, 0)
    if (total !== 100) result[others[0]] += 100 - total
  }
  return result
}

function renormalizeObjectives(weights, changedId, newValue, siblingIds) {
  const others = siblingIds.filter((k) => k !== changedId)
  const remaining = 100 - newValue
  const currentOthersTotal = others.reduce((sum, k) => sum + (weights[k] ?? 0), 0)
  const result = { ...weights, [changedId]: newValue }
  if (currentOthersTotal === 0) {
    const share = Math.floor(remaining / others.length)
    others.forEach((k, i) => { result[k] = i === others.length - 1 ? remaining - share * (others.length - 1) : share })
  } else {
    others.forEach((k) => { result[k] = Math.round(((weights[k] ?? 0) / currentOthersTotal) * remaining) })
    const total = others.reduce((s, k) => s + result[k], newValue)
    if (total !== 100) result[others[0]] += 100 - total
  }
  return result
}

export const useWeightStore = create((set) => ({
  perspectiveWeights: { ...mockPerspectiveWeights },
  objectiveWeights: { ...mockObjectiveWeights },

  setPerspectiveWeight: (perspectiveId, value) => set((state) => ({
    perspectiveWeights: renormalize(state.perspectiveWeights, perspectiveId, value),
  })),

  setObjectiveWeight: (objectiveId, value, siblingIds) => set((state) => ({
    objectiveWeights: renormalizeObjectives(state.objectiveWeights, objectiveId, value, siblingIds),
  })),

  resetToDefault: () => set({
    perspectiveWeights: { ...mockPerspectiveWeights },
    objectiveWeights: { ...mockObjectiveWeights },
  }),
}))
