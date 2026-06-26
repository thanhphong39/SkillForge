import { create } from 'zustand'
import strategyBuildingService from '../services/strategyBuildingService.js'
import strategySelectionService from '../services/strategySelectionService.js'
import { useBscContextStore } from './bscContextStore.js'
import { useBSCWorkflowStore } from './bscWorkflowStore.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

// Backend modelType → local store key
const MODEL_TYPE_TO_KEY = {
  SEVEN_S:    'sevenS',
  FIVE_FORCES:'fiveForces',
  PESTEL:     'pestel',
}
const MODEL_KEY_TO_TYPE = {
  sevenS:     'SEVEN_S',
  fiveForces: 'FIVE_FORCES',
  pestel:     'PESTEL',
}

// ── Build analysisItemsRaw from nested state ──────────────────────────────────

const buildAnalysisItems = (sevenS, fiveForces, pestel) => {
  const items = []
  const addGroup = (modelKey, group) => {
    const modelType = MODEL_KEY_TO_TYPE[modelKey]
    Object.entries(group).forEach(([factor, entries]) => {
      ;(entries || []).forEach((entry, idx) => {
        items.push({ id: entry.id, modelType, factorCode: factor, content: entry.value, displayOrder: idx })
      })
    })
  }
  addGroup('sevenS', sevenS)
  addGroup('fiveForces', fiveForces)
  addGroup('pestel', pestel)
  return items
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useSWOTStore = create((set, get) => ({
  // Raw backend state (needed for ID mapping)
  analysisItemsRaw: [],
  swotItemsRaw: [],

  // Nested analysis items (for display, keeps page interface compatible)
  sevenS: {},
  fiveForces: {},
  pestel: {},

  // SWOT selections (arrays of sourceAnalysisItemId)
  swotS: [],
  swotW: [],
  swotO: [],
  swotT: [],

  // Candidate strategies (frontend-friendly format with backend IDs)
  strategies: [],

  // B3 selection
  b3Selected: [],
  b3Notes: {},

  loading: false,
  saving: false,
  error: null,

  // ── Fetch B2 + B3 data ───────────────────────────────────────────────────
  fetch: async (strategyId) => {
    if (!strategyId) return
    set({ loading: true, error: null })
    try {
      // Load full B2 state (analysis items + swot items + candidates)
      const building = await strategyBuildingService.getBuilding(strategyId)
      const analysisItemsRaw = building?.analysisItems || []
      const swotItemsRaw = (building?.swotItems || []).map((si) => ({
        id: si.id,
        swotType: String(si.swotType),
        sourceAnalysisItemId: si.sourceAnalysisItemId,
      }))

      // Reconstruct nested analysis items by model type
      const sevenS = {}; const fiveForces = {}; const pestel = {}
      analysisItemsRaw.forEach((item) => {
        const key = MODEL_TYPE_TO_KEY[item.modelType]
        if (!key) return
        const target = { sevenS, fiveForces, pestel }[key]
        if (!target[item.factorCode]) target[item.factorCode] = []
        target[item.factorCode].push({ id: item.id, value: item.content })
      })

      // SWOT selections
      const swotS = swotItemsRaw.filter((i) => i.swotType === 'S').map((i) => i.sourceAnalysisItemId)
      const swotW = swotItemsRaw.filter((i) => i.swotType === 'W').map((i) => i.sourceAnalysisItemId)
      const swotO = swotItemsRaw.filter((i) => i.swotType === 'O').map((i) => i.sourceAnalysisItemId)
      const swotT = swotItemsRaw.filter((i) => i.swotType === 'T').map((i) => i.sourceAnalysisItemId)

      // Candidate strategies
      const rawCandidates = building?.candidateStrategies || []
      const strategies = rawCandidates
        .filter((cs) => cs.status !== 'DELETED')
        .map((cs) => ({
          id: cs.id,
          type: String(cs.strategyGroup),
          name: cs.name,
          description: cs.description || '',
          sItems: (cs.swotItems || []).filter((si) => String(si.swotType) === 'S').map((si) => si.sourceAnalysisItemId),
          wItems: (cs.swotItems || []).filter((si) => String(si.swotType) === 'W').map((si) => si.sourceAnalysisItemId),
          oItem: (cs.swotItems || []).find((si) => String(si.swotType) === 'O')?.sourceAnalysisItemId ?? null,
          tItem: (cs.swotItems || []).find((si) => String(si.swotType) === 'T')?.sourceAnalysisItemId ?? null,
        }))

      // Load B3 selection
      let b3Selected = []
      try {
        const selectionResp = await strategySelectionService.get(strategyId)
        b3Selected = ((selectionResp?.selectedStrategies) || [])
          .sort((a, b) => (a.priorityOrder ?? 0) - (b.priorityOrder ?? 0))
          .map((s) => s.candidateStrategyId)
          .filter(Boolean)
      } catch {
        // B3 not started yet, ignore
      }

      set({ analysisItemsRaw, swotItemsRaw, sevenS, fiveForces, pestel, swotS, swotW, swotO, swotT, strategies, b3Selected, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  // ── Source model CRUD (7S / 5 Forces / PESTEL) ───────────────────────────
  addSourceItem: (modelKey, factor, value) => {
    const id = uid()
    set((state) => ({
      [modelKey]: {
        ...state[modelKey],
        [factor]: [...(state[modelKey][factor] || []), { id, value: value.trim() }],
      },
      analysisItemsRaw: [
        ...state.analysisItemsRaw,
        {
          id,
          modelType: MODEL_KEY_TO_TYPE[modelKey],
          factorCode: factor,
          content: value.trim(),
          displayOrder: (state[modelKey][factor] || []).length,
        },
      ],
    }))
    // Fire-and-forget sync to backend
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      const all = buildAnalysisItems(get().sevenS, get().fiveForces, get().pestel)
      strategyBuildingService.upsertAnalysisItems(strategyId, all).catch(console.error)
    }
  },

  updateSourceItem: (modelKey, factor, id, value) => {
    set((state) => ({
      [modelKey]: {
        ...state[modelKey],
        [factor]: (state[modelKey][factor] || []).map((item) =>
          item.id === id ? { ...item, value: value.trim() } : item
        ),
      },
      analysisItemsRaw: state.analysisItemsRaw.map((item) =>
        item.id === id ? { ...item, content: value.trim() } : item
      ),
    }))
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      const all = buildAnalysisItems(get().sevenS, get().fiveForces, get().pestel)
      strategyBuildingService.upsertAnalysisItems(strategyId, all).catch(console.error)
    }
  },

  removeSourceItem: (modelKey, factor, id) => {
    const { swotItemsRaw } = get()
    // Delete associated swot item if exists
    const relatedSwotItem = swotItemsRaw.find((si) => si.sourceAnalysisItemId === id)
    if (relatedSwotItem) {
      const strategyId = useBscContextStore.getState().strategyId
      if (strategyId) {
        strategyBuildingService.deleteSwotItem(relatedSwotItem.id).catch(console.error)
      }
    }

    set((state) => ({
      [modelKey]: {
        ...state[modelKey],
        [factor]: (state[modelKey][factor] || []).filter((item) => item.id !== id),
      },
      analysisItemsRaw: state.analysisItemsRaw.filter((item) => item.id !== id),
      swotItemsRaw: state.swotItemsRaw.filter((si) => si.sourceAnalysisItemId !== id),
      swotS: state.swotS.filter((sid) => sid !== id),
      swotW: state.swotW.filter((sid) => sid !== id),
      swotO: state.swotO.filter((sid) => sid !== id),
      swotT: state.swotT.filter((sid) => sid !== id),
    }))

    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      const all = buildAnalysisItems(get().sevenS, get().fiveForces, get().pestel)
      strategyBuildingService.upsertAnalysisItems(strategyId, all).catch(console.error)
    }
  },

  // ── SWOT selection ────────────────────────────────────────────────────────
  toggleSwotItem: async (quadrant, analysisItemId) => {
    const key = `swot${quadrant}`
    const opposite = { S: 'W', W: 'S', O: 'T', T: 'O' }[quadrant]
    const oppositeKey = `swot${opposite}`
    const { swotItemsRaw } = get()
    const strategyId = useBscContextStore.getState().strategyId
    const isSelected = get()[key].includes(analysisItemId)

    if (isSelected) {
      // Deselect: delete swot item from backend
      const swotItem = swotItemsRaw.find(
        (si) => si.sourceAnalysisItemId === analysisItemId && si.swotType === quadrant
      )
      if (swotItem && strategyId) {
        try {
          await strategyBuildingService.deleteSwotItem(swotItem.id)
        } catch (e) {
          console.error('deleteSwotItem failed:', e)
        }
      }
      set((state) => ({
        [key]: state[key].filter((id) => id !== analysisItemId),
        swotItemsRaw: state.swotItemsRaw.filter(
          (si) => !(si.sourceAnalysisItemId === analysisItemId && si.swotType === quadrant)
        ),
      }))
    } else {
      // Select: create swot item in backend
      const isInOpposite = get()[oppositeKey].includes(analysisItemId)

      let newSwotItem = { id: uid(), swotType: quadrant, sourceAnalysisItemId: analysisItemId }
      if (strategyId) {
        try {
          // createSwotItem returns StrategyBuildingResponse — find the matching swot item in swotItems[]
          const buildingResp = await strategyBuildingService.createSwotItem(strategyId, {
            swotType: quadrant,
            sourceAnalysisItemId: analysisItemId,
          })
          const created = (buildingResp?.swotItems || []).find(
            (si) => String(si.swotType) === quadrant && si.sourceAnalysisItemId === analysisItemId
          )
          if (created?.id) {
            newSwotItem = { id: created.id, swotType: quadrant, sourceAnalysisItemId: analysisItemId }
          }
        } catch (e) {
          console.error('createSwotItem failed:', e)
        }
      }

      // If was in opposite quadrant, remove it
      if (isInOpposite) {
        const oppositeSwotItem = get().swotItemsRaw.find(
          (si) => si.sourceAnalysisItemId === analysisItemId && si.swotType === opposite
        )
        if (oppositeSwotItem && strategyId) {
          strategyBuildingService.deleteSwotItem(oppositeSwotItem.id).catch(console.error)
        }
      }

      set((state) => ({
        [key]: [...state[key], analysisItemId],
        [oppositeKey]: isInOpposite
          ? state[oppositeKey].filter((id) => id !== analysisItemId)
          : state[oppositeKey],
        swotItemsRaw: [
          ...state.swotItemsRaw.filter(
            (si) => !(si.sourceAnalysisItemId === analysisItemId && si.swotType === opposite)
          ),
          newSwotItem,
        ],
      }))
    }
  },

  // ── Candidate strategies ──────────────────────────────────────────────────
  addStrategy: async (data) => {
    // data = { type, name, description, sItems: [analysisItemId], wItems, oItem, tItem }
    const strategyId = useBscContextStore.getState().strategyId
    const { swotItemsRaw } = get()

    const resolveSwotIds = (analysisIds, swotType) =>
      (analysisIds || [])
        .map((aid) => swotItemsRaw.find((si) => si.sourceAnalysisItemId === aid && si.swotType === swotType)?.id)
        .filter(Boolean)

    const swotItemIds = [
      ...resolveSwotIds(data.sItems, 'S'),
      ...resolveSwotIds(data.wItems, 'W'),
      ...resolveSwotIds(data.oItem ? [data.oItem] : [], 'O'),
      ...resolveSwotIds(data.tItem ? [data.tItem] : [], 'T'),
    ]

    if (strategyId) {
      try {
        const response = await strategyBuildingService.createCandidateStrategy(strategyId, {
          strategyGroup: data.type,
          name: data.name,
          description: data.description || '',
          swotItemIds,
          displayOrder: get().strategies.length,
        })
        const newStrategy = {
          id: response.id,
          type: response.strategyGroup,
          name: response.name,
          description: response.description || '',
          sItems: data.sItems || [],
          wItems: data.wItems || [],
          oItem: data.oItem ?? null,
          tItem: data.tItem ?? null,
        }
        set((state) => ({ strategies: [...state.strategies, newStrategy] }))
      } catch (e) {
        console.error('createCandidateStrategy failed:', e)
      }
    } else {
      // No backend — local fallback
      const newStrategy = { ...data, id: uid() }
      set((state) => ({ strategies: [...state.strategies, newStrategy] }))
    }
  },

  updateStrategy: async (id, data) => {
    const strategyId = useBscContextStore.getState().strategyId
    const { swotItemsRaw } = get()

    const resolveSwotIds = (analysisIds, swotType) =>
      (analysisIds || [])
        .map((aid) => swotItemsRaw.find((si) => si.sourceAnalysisItemId === aid && si.swotType === swotType)?.id)
        .filter(Boolean)

    const swotItemIds = [
      ...resolveSwotIds(data.sItems, 'S'),
      ...resolveSwotIds(data.wItems, 'W'),
      ...resolveSwotIds(data.oItem ? [data.oItem] : [], 'O'),
      ...resolveSwotIds(data.tItem ? [data.tItem] : [], 'T'),
    ]

    // Update local immediately
    set((state) => ({
      strategies: state.strategies.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }))

    if (strategyId) {
      strategyBuildingService
        .updateCandidateStrategy(id, {
          strategyGroup: data.type,
          name: data.name,
          description: data.description || '',
          swotItemIds,
        })
        .catch(console.error)
    }
  },

  deleteStrategy: async (id) => {
    set((state) => ({ strategies: state.strategies.filter((s) => s.id !== id) }))
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      strategyBuildingService.deleteCandidateStrategy(id).catch(console.error)
    }
  },

  // ── Helpers for pages ─────────────────────────────────────────────────────
  getAllSevenSItems: () => {
    const { sevenS } = get()
    return Object.entries(sevenS).flatMap(([factor, items]) =>
      (items || []).map((item) => ({ ...item, factor }))
    )
  },

  getAllExternalItems: () => {
    const { fiveForces, pestel } = get()
    const ff = Object.entries(fiveForces).flatMap(([factor, items]) =>
      (items || []).map((item) => ({ ...item, factor, source: 'fiveForces' }))
    )
    const pe = Object.entries(pestel).flatMap(([factor, items]) =>
      (items || []).map((item) => ({ ...item, factor, source: 'pestel' }))
    )
    return [...ff, ...pe]
  },

  getUsedSwotItemIds: () => {
    const { strategies } = get()
    const used = new Set()
    strategies.forEach((s) => {
      ;(s.sItems || []).forEach((id) => used.add(id))
      ;(s.wItems || []).forEach((id) => used.add(id))
      if (s.oItem) used.add(s.oItem)
      if (s.tItem) used.add(s.tItem)
    })
    return used
  },

  // ── B3 selection ──────────────────────────────────────────────────────────
  toggleB3Strategy: async (id) => {
    const { b3Selected } = get()
    const already = b3Selected.includes(id)

    let newSelected
    if (already) {
      newSelected = b3Selected.filter((x) => x !== id)
      set((state) => {
        const newNotes = { ...state.b3Notes }
        delete newNotes[id]
        return { b3Selected: newSelected, b3Notes: newNotes }
      })
    } else {
      if (b3Selected.length >= 2) return
      newSelected = [...b3Selected, id]
      set((state) => ({
        b3Selected: newSelected,
        b3Notes: { ...state.b3Notes, [id]: '' },
      }))
    }

    // Sync to backend
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      strategySelectionService.select(strategyId, newSelected).catch(console.error)
    }
  },

  setB3Note: (id, note) =>
    set((state) => ({ b3Notes: { ...state.b3Notes, [id]: note } })),

  validateB3: () => {
    const { b3Selected, strategies } = get()
    const errors = []
    if (b3Selected.length === 0) errors.push('Cần chọn ít nhất 1 chiến lược')
    if (b3Selected.length > 2) errors.push('Không được chọn quá 2 chiến lược')
    b3Selected.forEach((id) => {
      if (!strategies.find((s) => s.id === id))
        errors.push(`Chiến lược ${id} không còn tồn tại — vui lòng chọn lại`)
    })
    return errors
  },

  validate: () => {
    const state = get()
    const errors = []
    const has7S = Object.values(state.sevenS).some((arr) => arr?.length > 0)
    const has5F = Object.values(state.fiveForces).some((arr) => arr?.length > 0)
    const hasPe = Object.values(state.pestel).some((arr) => arr?.length > 0)
    if (!has7S) errors.push('Mô hình 7S: cần nhập ít nhất 1 yếu tố')
    if (!has5F) errors.push('Mô hình 5 Áp lực: cần nhập ít nhất 1 yếu tố')
    if (!hasPe) errors.push('Mô hình PESTEL: cần nhập ít nhất 1 yếu tố')
    if (state.swotS.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Điểm mạnh (S)')
    if (state.swotW.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Điểm yếu (W)')
    if (state.swotO.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Cơ hội (O)')
    if (state.swotT.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Thách thức (T)')
    if (state.strategies.length === 0) errors.push('Chiến lược: cần tạo ít nhất 1 chiến lược')
    if (state.strategies.length > 12) errors.push('Chiến lược: tổng không được vượt quá 12')
    return errors
  },

  // ── Complete B2 ───────────────────────────────────────────────────────────
  completeB2: async () => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return ['Chưa khởi tạo chiến lược.']

    const errs = get().validate()
    if (errs.length > 0) return errs

    set({ saving: true, error: null })
    try {
      // Save all analysis items first
      const allItems = buildAnalysisItems(get().sevenS, get().fiveForces, get().pestel)
      if (allItems.length > 0) {
        await strategyBuildingService.upsertAnalysisItems(strategyId, allItems)
      }
      await strategyBuildingService.complete(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B2')
      set({ saving: false })
      return []
    } catch (e) {
      set({ saving: false, error: e.message })
      return [e.message]
    }
  },

  // ── Complete B3 ───────────────────────────────────────────────────────────
  completeB3: async () => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return ['Chưa khởi tạo chiến lược.']

    const errs = get().validateB3()
    if (errs.length > 0) return errs

    set({ saving: true, error: null })
    try {
      await strategySelectionService.select(strategyId, get().b3Selected)
      await strategySelectionService.complete(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B3')
      set({ saving: false })
      return []
    } catch (e) {
      set({ saving: false, error: e.message })
      return [e.message]
    }
  },
}))
