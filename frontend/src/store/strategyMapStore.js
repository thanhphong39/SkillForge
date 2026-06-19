import { create } from 'zustand'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

const PERSPECTIVE_KEYS = ['FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_AND_GROWTH']

export const useStrategyMapStore = create((set, get) => ({
  // strategyObjectives[strategyId] = [{id, name, description, perspective, order}]
  strategyObjectives: {},
  // strategyCausalLinks[strategyId] = [{id, sourceId, targetId}]
  strategyCausalLinks: {},
  // Final merged objectives (used when 2 strategies selected in B3)
  finalObjectives: [],
  finalCausalLinks: [],
  // merge decisions: sourceObjId → 'keep' | 'remove' | 'merged:<finalId>'
  mergeDecisions: {},

  // Ensure slots exist for each strategy ID
  initForStrategies: (strategyIds) => set((state) => {
    const objs = { ...state.strategyObjectives }
    const links = { ...state.strategyCausalLinks }
    strategyIds.forEach((id) => {
      if (!objs[id]) objs[id] = []
      if (!links[id]) links[id] = []
    })
    return { strategyObjectives: objs, strategyCausalLinks: links }
  }),

  // ── Objective CRUD ────────────────────────────────────────────
  addObjective: (strategyId, { name, description = '', perspective }) => set((state) => {
    const objs = state.strategyObjectives[strategyId] ?? []
    if (objs.length >= 12) return state
    const newObj = { id: uid(), name: name.trim(), description: description.trim(), perspective, order: objs.length }
    return {
      strategyObjectives: { ...state.strategyObjectives, [strategyId]: [...objs, newObj] },
    }
  }),

  updateObjective: (strategyId, objId, updates) => set((state) => ({
    strategyObjectives: {
      ...state.strategyObjectives,
      [strategyId]: (state.strategyObjectives[strategyId] ?? []).map((o) =>
        o.id === objId ? { ...o, ...updates } : o
      ),
    },
  })),

  removeObjective: (strategyId, objId) => set((state) => ({
    strategyObjectives: {
      ...state.strategyObjectives,
      [strategyId]: (state.strategyObjectives[strategyId] ?? []).filter((o) => o.id !== objId),
    },
    strategyCausalLinks: {
      ...state.strategyCausalLinks,
      [strategyId]: (state.strategyCausalLinks[strategyId] ?? []).filter(
        (l) => l.sourceId !== objId && l.targetId !== objId
      ),
    },
  })),

  // ── Causal Links ──────────────────────────────────────────────
  addCausalLink: (strategyId, sourceId, targetId) => set((state) => {
    const links = state.strategyCausalLinks[strategyId] ?? []
    if (sourceId === targetId) return state
    if (links.some((l) => l.sourceId === sourceId && l.targetId === targetId)) return state
    return {
      strategyCausalLinks: {
        ...state.strategyCausalLinks,
        [strategyId]: [...links, { id: uid(), sourceId, targetId }],
      },
    }
  }),

  removeCausalLink: (strategyId, linkId) => set((state) => ({
    strategyCausalLinks: {
      ...state.strategyCausalLinks,
      [strategyId]: (state.strategyCausalLinks[strategyId] ?? []).filter((l) => l.id !== linkId),
    },
  })),

  // ── Merge step (for 2-strategy case) ─────────────────────────
  keepObjective: (strategyId, objId) => set((state) => {
    const obj = (state.strategyObjectives[strategyId] ?? []).find((o) => o.id === objId)
    if (!obj) return state
    const finalId = `final-${uid()}`
    const finalObj = { ...obj, id: finalId, type: 'ORIGINAL', sourceIds: [objId] }
    const existing = state.finalObjectives.filter((f) => !f.sourceIds.includes(objId))
    return {
      finalObjectives: [...existing, finalObj],
      mergeDecisions: { ...state.mergeDecisions, [objId]: `keep` },
    }
  }),

  removeFromMerge: (objId) => set((state) => {
    const finalObjUsingIt = state.finalObjectives.find((f) => f.sourceIds.includes(objId))
    let newFinals = state.finalObjectives
    if (finalObjUsingIt && finalObjUsingIt.sourceIds.length <= 1) {
      newFinals = state.finalObjectives.filter((f) => f.id !== finalObjUsingIt.id)
    }
    return {
      finalObjectives: newFinals,
      mergeDecisions: { ...state.mergeDecisions, [objId]: 'remove' },
    }
  }),

  mergeObjectives: (sourceIds, { name, description = '', perspective }) => set((state) => {
    const finalId = `final-${uid()}`
    const finalObj = {
      id: finalId,
      name: name.trim(),
      description: description.trim(),
      perspective,
      type: 'MERGED',
      sourceIds,
      order: state.finalObjectives.length,
    }
    const existing = state.finalObjectives.filter((f) => !f.sourceIds.some((s) => sourceIds.includes(s)))
    const newDecisions = { ...state.mergeDecisions }
    sourceIds.forEach((id) => { newDecisions[id] = `merged-${finalId}` })
    return { finalObjectives: [...existing, finalObj], mergeDecisions: newDecisions }
  }),

  updateFinalObjective: (finalId, updates) => set((state) => ({
    finalObjectives: state.finalObjectives.map((f) =>
      f.id === finalId
        ? { ...f, ...updates, type: f.type === 'ORIGINAL' ? 'MANUAL_EDITED' : f.type }
        : f
    ),
  })),

  removeFinalObjective: (finalId) => set((state) => {
    const obj = state.finalObjectives.find((f) => f.id === finalId)
    const newDecisions = { ...state.mergeDecisions }
    if (obj) obj.sourceIds.forEach((sid) => { delete newDecisions[sid] })
    return {
      finalObjectives: state.finalObjectives.filter((f) => f.id !== finalId),
      mergeDecisions: newDecisions,
      finalCausalLinks: state.finalCausalLinks.filter((l) => l.sourceId !== finalId && l.targetId !== finalId),
    }
  }),

  addFinalCausalLink: (sourceId, targetId) => set((state) => {
    if (sourceId === targetId) return state
    if (state.finalCausalLinks.some((l) => l.sourceId === sourceId && l.targetId === targetId)) return state
    return { finalCausalLinks: [...state.finalCausalLinks, { id: uid(), sourceId, targetId }] }
  }),

  removeFinalCausalLink: (linkId) => set((state) => ({
    finalCausalLinks: state.finalCausalLinks.filter((l) => l.id !== linkId),
  })),

  // Return the "effective" final objectives for B5 input
  getEffectiveFinalObjectives: (b3Selected) => {
    const state = get()
    if (b3Selected.length === 1) {
      return (state.strategyObjectives[b3Selected[0]] ?? []).map((o) => ({
        ...o,
        type: 'ORIGINAL',
        sourceIds: [o.id],
      }))
    }
    return state.finalObjectives
  },

  validate: (b3Selected) => {
    const state = get()
    const errors = []
    b3Selected.forEach((stratId) => {
      const objs = state.strategyObjectives[stratId] ?? []
      if (objs.length === 0) errors.push(`Chưa có mục tiêu nào cho chiến lược này`)
      if (objs.length > 12) errors.push(`Mỗi chiến lược tối đa 12 mục tiêu`)
      PERSPECTIVE_KEYS.forEach((p) => {
        if (!objs.some((o) => o.perspective === p)) {
          const LABELS = { FINANCIAL: 'Tài chính', CUSTOMER: 'Khách hàng', INTERNAL_PROCESS: 'Quy trình nội bộ', LEARNING_AND_GROWTH: 'Học hỏi & phát triển' }
          errors.push(`Mỗi chiến lược cần ít nhất 1 mục tiêu thuộc góc độ "${LABELS[p]}"`)
        }
      })
    })
    if (b3Selected.length === 2) {
      if (state.finalObjectives.length === 0) errors.push('Cần thực hiện bước gộp bản đồ chiến lược')
      PERSPECTIVE_KEYS.forEach((p) => {
        if (!state.finalObjectives.some((f) => f.perspective === p)) {
          const LABELS = { FINANCIAL: 'Tài chính', CUSTOMER: 'Khách hàng', INTERNAL_PROCESS: 'Quy trình nội bộ', LEARNING_AND_GROWTH: 'Học hỏi & phát triển' }
          errors.push(`Bản đồ tổng thiếu góc độ "${LABELS[p]}"`)
        }
      })
    }
    return errors
  },
}))
