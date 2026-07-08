import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import companyService from '../services/companyService.js'
import departmentService from '../services/departmentService.js'
import employeeService from '../services/employeeService.js'
import userAccountService from '../services/userAccountService.js'

// Map FE role label → BE UserRole enum
export const ROLE_FE_TO_BE = {
  ceo:     'CEO',
  admin:   'COMPANY_ADMIN',
  manager: 'DEPARTMENT_HEAD',
  staff:   'EMPLOYEE',
}
export const ROLE_BE_TO_FE = {
  CEO:            'ceo',
  COMPANY_ADMIN:  'admin',
  DEPARTMENT_HEAD:'manager',
  EMPLOYEE:       'staff',
}
export const ROLE_LABELS = {
  ceo:     'Giám đốc',
  admin:   'Quản trị viên',
  manager: 'Trưởng phòng',
  staff:   'Nhân viên',
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

      // ── Load from backend when companyId exists ─────────────────────────────
      init: async () => {
        const { companyId, loading } = get()
        if (!companyId || loading) return
        set({ loading: true, error: null })
        try {
          const [company, departments, employees] = await Promise.all([
            companyService.getById(companyId),
            departmentService.listByCompany(companyId),
            employeeService.listByCompany(companyId),
          ])
          set((s) => ({
            company: {
              ...s.company,
              // Merge BE fields (name, taxCode, industry, size) with local-only UI fields
              name:     company.name     ?? s.company.name,
              taxCode:  company.taxCode  ?? s.company.taxCode,
              industry: company.industry ?? s.company.industry,
              size:     company.size     ?? s.company.size,
            },
            departments: (departments || []).map((d) => ({
              id:          String(d.id),
              name:        d.name,
              code:        d.code,
              color:       d.color || '#3b82f6',
              description: d.description || '',
              managerId:   null,
            })),
            users: (employees || []).map((e) => ({
              id:         String(e.id),
              name:       e.fullName,
              email:      e.email,
              phone:      e.phone || '',
              title:      e.positionTitle || '',
              deptId:     String(e.departmentId),
              role:       'staff',       // default; no account-status API yet
              beRole:     null,
              accountId:  null,
              hasAccount: false,
            })),
            loading: false,
          }))
        } catch (e) {
          set({ loading: false, error: e.message })
        }
      },

      // ── Create company (first-time only) ────────────────────────────────────
      createCompany: async (data) => {
        set({ loading: true, error: null })
        try {
          const created = await companyService.create({
            name:     data.name,
            taxCode:  data.taxCode  || null,
            industry: data.industry || null,
            size:     data.size     || null,
          })
          // Persist local-only UI fields + BE response
          set((s) => ({
            companyId: String(created.id),
            company: {
              ...s.company,
              ...data,
              name:     created.name,
              taxCode:  created.taxCode  || data.taxCode  || '',
              industry: created.industry || data.industry || '',
              size:     created.size     || data.size     || '',
            },
            loading: false,
          }))
          return { ok: true, company: created }
        } catch (e) {
          set({ loading: false, error: e.message })
          return { ok: false, error: e.message }
        }
      },

      // ── Update company (name/taxCode/industry/size → BE; rest stays local) ──
      updateCompany: async (data) => {
        const { companyId } = get()
        // Always update local state immediately
        set((s) => ({ company: { ...s.company, ...data } }))
        if (!companyId) return { ok: true }
        try {
          await companyService.update(companyId, {
            name:     data.name,
            taxCode:  data.taxCode  || null,
            industry: data.industry || null,
            size:     data.size     || null,
          })
          return { ok: true }
        } catch (e) {
          set({ error: e.message })
          return { ok: false, error: e.message }
        }
      },

      // ── Departments ─────────────────────────────────────────────────────────
      addDept: async (dept) => {
        const { companyId } = get()
        if (!companyId) {
          set((s) => ({ departments: [...s.departments, { id: `local-${Date.now()}`, ...dept }] }))
          return { ok: false, error: 'Chưa có công ty' }
        }
        try {
          const created = await departmentService.create(companyId, {
            name:        dept.name,
            code:        dept.code,
            color:       dept.color || '#3b82f6',
            description: dept.description || '',
          })
          set((s) => ({
            departments: [
              ...s.departments,
              {
                id:          String(created.id),
                name:        created.name,
                code:        created.code,
                color:       created.color || dept.color || '#3b82f6',
                description: created.description || '',
                managerId:   dept.managerId || null,
              },
            ],
          }))
          return { ok: true }
        } catch (e) {
          set({ error: e.message })
          return { ok: false, error: e.message }
        }
      },

      updateDept: async (id, changes) => {
        set((s) => ({ departments: s.departments.map((d) => (d.id === id ? { ...d, ...changes } : d)) }))
        const dept = get().departments.find((d) => d.id === id)
        if (dept && !id.startsWith('local-')) {
          departmentService.update(id, {
            name:        changes.name        ?? dept.name,
            code:        changes.code        ?? dept.code,
            color:       changes.color       ?? dept.color,
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

      // ── Users (employees + accounts) ────────────────────────────────────────
      addUser: async (user) => {
        const { companyId } = get()
        if (!companyId) {
          set((s) => ({ users: [...s.users, { id: `local-${Date.now()}`, ...user, hasAccount: false }] }))
          return { ok: false, error: 'Chưa có công ty' }
        }
        if (!user.deptId) {
          return { ok: false, error: 'Vui lòng chọn phòng ban' }
        }
        try {
          // Step 1: Create employee profile
          const created = await employeeService.create(companyId, {
            departmentId:  user.deptId,
            fullName:      user.name,
            email:         user.email,
            phone:         user.phone || '',
            positionTitle: user.title || '',
          })

          // Step 2: Create login account
          const beRole   = ROLE_FE_TO_BE[user.role] || 'EMPLOYEE'
          const password = user.password?.trim() || '123456'
          let accountId  = null
          let hasAccount = false
          try {
            const account = await userAccountService.create(created.id, {
              email:    user.email,
              password,
              role:     beRole,
            })
            accountId  = account.id ? String(account.id) : null
            hasAccount = true
          } catch (accErr) {
            console.warn('[adminStore] Account creation failed:', accErr.message)
          }

          set((s) => ({
            users: [
              ...s.users,
              {
                id:         String(created.id),
                name:       created.fullName,
                email:      created.email,
                phone:      created.phone || '',
                title:      created.positionTitle || '',
                deptId:     String(created.departmentId),
                role:       user.role || 'staff',
                beRole,
                accountId,
                hasAccount,
              },
            ],
          }))
          return { ok: true, hasAccount }
        } catch (e) {
          set({ error: e.message })
          return { ok: false, error: e.message }
        }
      },

      updateUser: async (id, changes) => {
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...changes } : u)) }))
        if (!id.startsWith('local-')) {
          const user = { ...get().users.find((u) => u.id === id), ...changes }
          employeeService.update(id, {
            departmentId:  user.deptId,
            fullName:      user.name,
            email:         user.email,
            phone:         user.phone || '',
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

      // ── Periods (local only) ────────────────────────────────────────────────
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
      partialize: (s) => ({
        companyId:        s.companyId,
        company:          s.company,
        periods:          s.periods,
        ratingThresholds: s.ratingThresholds,
      }),
    }
  )
)
