import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import companyService from '../services/companyService.js'
import departmentService from '../services/departmentService.js'
import employeeService from '../services/employeeService.js'

// Read companyId from the BSC frontend context (Zustand persist key = 'bsc-context')
function readCompanyId() {
  try {
    const raw = localStorage.getItem('bsc-context')
    return JSON.parse(raw)?.state?.companyId ?? null
  } catch {
    return null
  }
}

const DEFAULT_PERIODS = [
  { id: 'period-2024-q1', year: 2024, quarter: 1, label: 'Q1/2024', startDate: '2024-01-01', endDate: '2024-03-31', isActive: false },
  { id: 'period-2024-q2', year: 2024, quarter: 2, label: 'Q2/2024', startDate: '2024-04-01', endDate: '2024-06-30', isActive: false },
  { id: 'period-2024-q3', year: 2024, quarter: 3, label: 'Q3/2024', startDate: '2024-07-01', endDate: '2024-09-30', isActive: false },
  { id: 'period-2024-q4', year: 2024, quarter: 4, label: 'Q4/2024', startDate: '2024-10-01', endDate: '2024-12-31', isActive: true },
  { id: 'period-2025-q1', year: 2025, quarter: 1, label: 'Q1/2025', startDate: '2025-01-01', endDate: '2025-03-31', isActive: false },
]

export const useAdminStore = create(
  persist(
    (set, get) => ({
      companyId: null,
      company: {
        name: '',
        shortName: '',
        taxCode: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        industry: '',
        size: '',
        fiscalYearStart: 1,
        currentYear: new Date().getFullYear(),
      },
      departments: [],
      users: [],
      periods: [...DEFAULT_PERIODS],
      ratingThresholds: { excellent: 110, good: 90, average: 70 },
      loading: false,
      error: null,

      // Fetch company, departments and employees from backend
      init: async () => {
        const companyId = readCompanyId() || get().companyId
        if (!companyId) return
        set({ companyId, loading: true, error: null })
        try {
          const [company, departments, employees] = await Promise.all([
            companyService.getById(companyId),
            departmentService.listByCompany(companyId),
            employeeService.listByCompany(companyId),
          ])
          set((s) => ({
            company: {
              ...s.company,
              name: company.name ?? s.company.name,
              taxCode: company.taxCode ?? s.company.taxCode,
              industry: company.industry ?? s.company.industry,
              size: company.size ?? s.company.size,
            },
            departments: (departments || []).map((d) => ({
              id: String(d.id),
              name: d.name,
              code: d.code,
              color: d.color || '#3b82f6',
              description: d.description || '',
              managerId: null,
            })),
            users: (employees || []).map((e) => ({
              id: String(e.id),
              name: e.fullName,
              email: e.email,
              title: e.positionTitle || '',
              deptId: String(e.departmentId),
              role: 'staff',
            })),
            loading: false,
          }))
        } catch (e) {
          set({ loading: false, error: e.message })
        }
      },

      // Company — sync name/taxCode/industry/size to backend; extra UI fields stay local
      updateCompany: async (changes) => {
        set((s) => ({ company: { ...s.company, ...changes } }))
        const { companyId, company } = get()
        if (companyId) {
          const merged = { ...company, ...changes }
          companyService.update(companyId, {
            name: merged.name,
            taxCode: merged.taxCode,
            industry: merged.industry,
            size: merged.size,
          }).catch(console.error)
        }
      },

      // Departments
      addDept: async (dept) => {
        const { companyId } = get()
        if (!companyId) {
          set((s) => ({ departments: [...s.departments, { id: `local-${Date.now()}`, ...dept }] }))
          return
        }
        try {
          const created = await departmentService.create(companyId, {
            name: dept.name,
            code: dept.code,
            color: dept.color || '#3b82f6',
            description: dept.description || '',
          })
          set((s) => ({
            departments: [
              ...s.departments,
              {
                id: String(created.id),
                name: created.name,
                code: created.code,
                color: created.color || dept.color || '#3b82f6',
                description: created.description || '',
                managerId: dept.managerId || null,
              },
            ],
          }))
        } catch (e) {
          set({ error: e.message })
        }
      },

      updateDept: async (id, changes) => {
        set((s) => ({ departments: s.departments.map((d) => (d.id === id ? { ...d, ...changes } : d)) }))
        const dept = get().departments.find((d) => d.id === id)
        if (dept) {
          departmentService.update(id, {
            name: changes.name ?? dept.name,
            code: changes.code ?? dept.code,
            color: changes.color ?? dept.color,
            description: changes.description ?? dept.description ?? '',
          }).catch(console.error)
        }
      },

      deleteDept: (id) => {
        set((s) => ({ departments: s.departments.filter((d) => d.id !== id) }))
        if (!id.startsWith('local-')) {
          departmentService.remove(id).catch(console.error)
        }
      },

      // Users (employees)
      addUser: async (user) => {
        const { companyId } = get()
        if (!companyId || !user.deptId) {
          set((s) => ({ users: [...s.users, { id: `local-${Date.now()}`, ...user }] }))
          return
        }
        try {
          const created = await employeeService.create(companyId, {
            departmentId: user.deptId,
            fullName: user.name,
            email: user.email,
            phone: user.phone || '',
            positionTitle: user.title || '',
          })
          set((s) => ({
            users: [
              ...s.users,
              {
                id: String(created.id),
                name: created.fullName,
                email: created.email,
                title: created.positionTitle || '',
                deptId: String(created.departmentId),
                role: user.role || 'staff',
              },
            ],
          }))
        } catch (e) {
          set({ error: e.message })
        }
      },

      updateUser: async (id, changes) => {
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...changes } : u)) }))
        if (!id.startsWith('local-')) {
          const user = { ...get().users.find((u) => u.id === id), ...changes }
          employeeService.update(id, {
            departmentId: user.deptId,
            fullName: user.name,
            email: user.email,
            phone: user.phone || '',
            positionTitle: user.title || '',
          }).catch(console.error)
        }
      },

      deleteUser: (id) => {
        set((s) => ({ users: s.users.filter((u) => u.id !== id) }))
        if (!id.startsWith('local-')) {
          employeeService.remove(id).catch(console.error)
        }
      },

      // Periods (local only — no backend endpoint)
      addPeriod: (period) =>
        set((s) => ({ periods: [...s.periods, { id: `period-${Date.now()}`, isActive: false, ...period }] })),
      updatePeriod: (id, changes) =>
        set((s) => ({ periods: s.periods.map((p) => (p.id === id ? { ...p, ...changes } : p)) })),
      deletePeriod: (id) =>
        set((s) => ({ periods: s.periods.filter((p) => p.id !== id) })),
      setActivePeriod: (id) =>
        set((s) => ({ periods: s.periods.map((p) => ({ ...p, isActive: p.id === id })) })),

      updateRatingThresholds: (t) =>
        set((s) => ({ ratingThresholds: { ...s.ratingThresholds, ...t } })),
    }),
    {
      name: 'skillforge-admin-store',
      // Persist companyId so admin can reload without depending on bsc-context
      partialize: (s) => ({
        companyId: s.companyId,
        company: s.company,
        periods: s.periods,
        ratingThresholds: s.ratingThresholds,
      }),
    }
  )
)
