import { create } from 'zustand'
import { mockSWOTItems, mockStrategies } from '../data/mockSWOT.js'

let nextId = 100

export const useSWOTStore = create((set) => ({
  items: mockSWOTItems.map((i) => ({ ...i })),
  strategies: mockStrategies.map((s) => ({ ...s })),

  addItem: (data) => set((state) => ({
    items: [...state.items, { ...data, id: `sw-new-${++nextId}` }],
  })),

  updateItem: (id, changes) => set((state) => ({
    items: state.items.map((item) => item.id === id ? { ...item, ...changes } : item),
  })),

  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),

  addStrategy: (data) => set((state) => ({
    strategies: [...state.strategies, { ...data, id: `strat-new-${++nextId}` }],
  })),

  updateStrategy: (id, changes) => set((state) => ({
    strategies: state.strategies.map((s) => s.id === id ? { ...s, ...changes } : s),
  })),

  deleteStrategy: (id) => set((state) => ({
    strategies: state.strategies.filter((s) => s.id !== id),
  })),

  toggleStrategySelected: (id) => set((state) => ({
    strategies: state.strategies.map((s) => s.id === id ? { ...s, selected: !s.selected } : s),
  })),

  setStrategyPriority: (id, priority) => set((state) => ({
    strategies: state.strategies.map((s) => s.id === id ? { ...s, priority } : s),
  })),
}))
