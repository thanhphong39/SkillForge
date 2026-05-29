import { create } from 'zustand'

const initialSteps = {
  B1: { status: 'completed', completedAt: '2024-01-15', label: 'Đánh giá' },
  B2: { status: 'completed', completedAt: '2024-01-22', label: 'Xây dựng Chiến lược' },
  B3: { status: 'active',    completedAt: null,          label: 'Kết quả chiến lược' },
  B4: { status: 'pending',   completedAt: null,          label: 'Bản đồ Chiến lược' },
  B5: { status: 'pending',   completedAt: null,          label: 'Mô hình Xương cá' },
  B6: { status: 'pending',   completedAt: null,          label: 'Đo lường & Chỉ tiêu' },
  B7: { status: 'pending',   completedAt: null,          label: 'Phân bổ Tỉ trọng' },
  B8: { status: 'pending',   completedAt: null,          label: 'Action Plan' },
}

export const useBSCWorkflowStore = create((set, get) => ({
  steps: initialSteps,

  markStepComplete: (stepId) => set((state) => ({
    steps: {
      ...state.steps,
      [stepId]: { ...state.steps[stepId], status: 'completed', completedAt: new Date().toISOString().split('T')[0] },
    },
  })),

  markStepActive: (stepId) => set((state) => ({
    steps: {
      ...state.steps,
      [stepId]: { ...state.steps[stepId], status: 'active' },
    },
  })),

  getCompletedCount: () => {
    const steps = get().steps
    return Object.values(steps).filter((s) => s.status === 'completed').length
  },

  getStepStatus: (stepId) => get().steps[stepId]?.status ?? 'pending',
}))
