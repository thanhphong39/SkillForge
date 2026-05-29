import { create } from 'zustand'
import { mockActionPlan } from '../data/mockActionPlan.js'

let nextId = 100

export const useActionPlanStore = create((set) => ({
  actions: mockActionPlan.map((a) => ({ ...a, milestones: a.milestones.map((m) => ({ ...m })) })),

  addAction: (data) => set((state) => ({
    actions: [...state.actions, { ...data, id: `ap-new-${++nextId}`, milestones: data.milestones ?? [] }],
  })),

  updateAction: (id, changes) => set((state) => ({
    actions: state.actions.map((a) => a.id === id ? { ...a, ...changes } : a),
  })),

  deleteAction: (id) => set((state) => ({
    actions: state.actions.filter((a) => a.id !== id),
  })),

  setStatus: (id, status) => set((state) => ({
    actions: state.actions.map((a) => a.id === id ? { ...a, status } : a),
  })),

  addMilestone: (actionId, milestone) => set((state) => ({
    actions: state.actions.map((a) =>
      a.id === actionId
        ? { ...a, milestones: [...a.milestones, { ...milestone, id: `ms-new-${++nextId}`, done: false }] }
        : a
    ),
  })),

  toggleMilestone: (actionId, milestoneId) => set((state) => ({
    actions: state.actions.map((a) =>
      a.id === actionId
        ? { ...a, milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, done: !m.done } : m) }
        : a
    ),
  })),
}))
