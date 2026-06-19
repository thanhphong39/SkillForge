import { create } from 'zustand'
import {
  mockSevenS, mockFiveForces, mockPestel,
  mockSwotS, mockSwotW, mockSwotO, mockSwotT,
  mockStrategies,
} from '../data/mockSWOT.js'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

const cloneMap = (map) =>
  Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.map((i) => ({ ...i }))]))

export const useSWOTStore = create((set, get) => ({
  // Source models
  sevenS: cloneMap(mockSevenS),
  fiveForces: cloneMap(mockFiveForces),
  pestel: cloneMap(mockPestel),

  // SWOT selections (arrays of item IDs)
  swotS: [...mockSwotS],
  swotW: [...mockSwotW],
  swotO: [...mockSwotO],
  swotT: [...mockSwotT],

  // Strategies
  strategies: mockStrategies.map((s) => ({ ...s, sItems: [...s.sItems], wItems: [...s.wItems] })),

  // B3 selection (max 2 strategy IDs)
  b3Selected: ['strat-1'],
  b3Notes: { 'strat-1': '' },

  // ── Source model actions ──────────────────────────────────────
  addSourceItem: (model, factor, value) => set((state) => ({
    [model]: {
      ...state[model],
      [factor]: [...state[model][factor], { id: uid(), value: value.trim() }],
    },
  })),

  updateSourceItem: (model, factor, id, value) => set((state) => ({
    [model]: {
      ...state[model],
      [factor]: state[model][factor].map((item) =>
        item.id === id ? { ...item, value: value.trim() } : item
      ),
    },
  })),

  removeSourceItem: (model, factor, id) => set((state) => {
    // Also remove from SWOT selections if present
    return {
      [model]: {
        ...state[model],
        [factor]: state[model][factor].filter((item) => item.id !== id),
      },
      swotS: state.swotS.filter((sid) => sid !== id),
      swotW: state.swotW.filter((sid) => sid !== id),
      swotO: state.swotO.filter((sid) => sid !== id),
      swotT: state.swotT.filter((sid) => sid !== id),
    }
  }),

  // ── SWOT selection actions ────────────────────────────────────
  // quadrant: 'S' | 'W' | 'O' | 'T'
  toggleSwotItem: (quadrant, itemId) => set((state) => {
    const key = `swot${quadrant}`
    const opposite = { S: 'swotW', W: 'swotS', O: 'swotT', T: 'swotO' }[quadrant]
    const current = state[key]
    if (current.includes(itemId)) {
      // deselect
      return { [key]: current.filter((id) => id !== itemId) }
    }
    // select — remove from opposite if present
    return {
      [key]: [...current, itemId],
      [opposite]: state[opposite].filter((id) => id !== itemId),
    }
  }),

  // ── Strategy actions ──────────────────────────────────────────
  addStrategy: (data) => set((state) => ({
    strategies: [...state.strategies, { ...data, id: uid() }],
  })),

  updateStrategy: (id, data) => set((state) => ({
    strategies: state.strategies.map((s) => s.id === id ? { ...s, ...data } : s),
  })),

  deleteStrategy: (id) => set((state) => ({
    strategies: state.strategies.filter((s) => s.id !== id),
  })),

  // ── Helpers ───────────────────────────────────────────────────
  // All item IDs already used across all strategies
  getUsedSwotItemIds: () => {
    const { strategies } = get()
    const used = new Set()
    strategies.forEach((s) => {
      s.sItems.forEach((id) => used.add(id))
      s.wItems.forEach((id) => used.add(id))
      if (s.oItem) used.add(s.oItem)
      if (s.tItem) used.add(s.tItem)
    })
    return used
  },

  // All 7S items as flat array with factor label
  getAllSevenSItems: () => {
    const { sevenS } = get()
    return Object.entries(sevenS).flatMap(([factor, items]) =>
      items.map((item) => ({ ...item, factor }))
    )
  },

  // All 5Forces + PESTEL items as flat array
  getAllExternalItems: () => {
    const { fiveForces, pestel } = get()
    const ff = Object.entries(fiveForces).flatMap(([factor, items]) =>
      items.map((item) => ({ ...item, factor, source: 'fiveForces' }))
    )
    const pe = Object.entries(pestel).flatMap(([factor, items]) =>
      items.map((item) => ({ ...item, factor, source: 'pestel' }))
    )
    return [...ff, ...pe]
  },

  // B3 actions
  toggleB3Strategy: (id) => set((state) => {
    const already = state.b3Selected.includes(id)
    if (already) {
      const newNotes = { ...state.b3Notes }
      delete newNotes[id]
      return { b3Selected: state.b3Selected.filter((x) => x !== id), b3Notes: newNotes }
    }
    if (state.b3Selected.length >= 2) return state // max 2
    return { b3Selected: [...state.b3Selected, id], b3Notes: { ...state.b3Notes, [id]: '' } }
  }),

  setB3Note: (id, note) => set((state) => ({
    b3Notes: { ...state.b3Notes, [id]: note },
  })),

  validateB3: () => {
    const { b3Selected, strategies } = get()
    const errors = []
    if (b3Selected.length === 0) errors.push('Cần chọn ít nhất 1 chiến lược')
    if (b3Selected.length > 2) errors.push('Không được chọn quá 2 chiến lược')
    b3Selected.forEach((id) => {
      if (!strategies.find((s) => s.id === id)) errors.push(`Chiến lược ${id} không còn tồn tại — vui lòng chọn lại`)
    })
    return errors
  },

  // Validate for B2 completion
  validate: () => {
    const state = get()
    const errors = []

    const has7SData = Object.values(state.sevenS).some((arr) => arr.length > 0)
    const hasFiveForcesData = Object.values(state.fiveForces).some((arr) => arr.length > 0)
    const hasPestelData = Object.values(state.pestel).some((arr) => arr.length > 0)

    if (!has7SData) errors.push('Mô hình 7S: cần nhập ít nhất 1 yếu tố')
    if (!hasFiveForcesData) errors.push('Mô hình 5 Áp lực: cần nhập ít nhất 1 yếu tố')
    if (!hasPestelData) errors.push('Mô hình PESTEL: cần nhập ít nhất 1 yếu tố')
    if (state.swotS.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Điểm mạnh (S)')
    if (state.swotW.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Điểm yếu (W)')
    if (state.swotO.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Cơ hội (O)')
    if (state.swotT.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Thách thức (T)')
    if (state.strategies.length === 0) errors.push('Chiến lược: cần tạo ít nhất 1 chiến lược')
    if (state.strategies.length > 12) errors.push('Chiến lược: tổng không được vượt quá 12')

    return errors
  },
}))
