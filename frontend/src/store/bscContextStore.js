import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import companyService from '../services/companyService.js'
import bscStrategyService from '../services/bscStrategyService.js'

export const useBscContextStore = create(
  persist(
    (set, get) => ({
      companyId: null,
      strategyId: null,
      loading: false,
      error: null,

      // Call after login — creates company + strategy if first time, otherwise reuses persisted IDs
      init: async () => {
        const { companyId, strategyId, loading } = get()
        if (loading) return
        if (strategyId) {
          // Already have a strategy — verify it still exists
          try {
            await bscStrategyService.getById(strategyId)
          } catch {
            // Strategy gone — clear and re-init
            set({ strategyId: null })
            await get().init()
          }
          return
        }

        set({ loading: true, error: null })
        try {
          let cId = companyId
          if (!cId) {
            const company = await companyService.create({
              name: 'Công ty CP Thiên Phú',
              industry: 'Technology',
              size: 'MEDIUM',
            })
            cId = company.id
            set({ companyId: cId })
          }

          const year = new Date().getFullYear()
          const strategy = await bscStrategyService.create(cId, {
            name: `Chiến lược BSC ${year}`,
            description: `Kế hoạch BSC năm ${year}`,
            year,
          })
          set({ strategyId: strategy.id, loading: false })
        } catch (e) {
          set({ error: e.message, loading: false })
        }
      },

      // Allow manual override (e.g. admin selects an existing strategy)
      setStrategyId: (id) => set({ strategyId: id }),
      setCompanyId: (id) => set({ companyId: id }),
      reset: () => set({ companyId: null, strategyId: null }),
    }),
    {
      name: 'bsc-context',
      partialize: (s) => ({ companyId: s.companyId, strategyId: s.strategyId }),
    }
  )
)
