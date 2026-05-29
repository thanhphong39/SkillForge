import { create } from 'zustand'
import { mockCompanyProfile, mockReadinessChecklist, mockFinancialSnapshot } from '../data/mockAssessment.js'

export const useAssessmentStore = create((set) => ({
  profile: { ...mockCompanyProfile },
  readinessItems: mockReadinessChecklist.map((item) => ({ ...item })),
  financialSnapshot: { ...mockFinancialSnapshot },

  updateProfile: (changes) => set((state) => ({
    profile: { ...state.profile, ...changes },
  })),

  toggleReadinessItem: (id) => set((state) => ({
    readinessItems: state.readinessItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ),
  })),

  updateFinancialSnapshot: (changes) => set((state) => ({
    financialSnapshot: { ...state.financialSnapshot, ...changes },
  })),

  getReadinessScore: () => {
    // Computed: percentage of checked items
    return undefined // accessed via selector in components
  },
}))
