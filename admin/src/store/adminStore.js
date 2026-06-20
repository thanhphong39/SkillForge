import { create } from 'zustand'
import { mockDepartments } from '../data/mockDepartments.js'
import { mockUsers } from '../data/mockUsers.js'

let nextId = 1000

const DEFAULT_PERIODS = [
  { id: 'period-2024-q1', year: 2024, quarter: 1, label: 'Q1/2024', startDate: '2024-01-01', endDate: '2024-03-31', isActive: false },
  { id: 'period-2024-q2', year: 2024, quarter: 2, label: 'Q2/2024', startDate: '2024-04-01', endDate: '2024-06-30', isActive: false },
  { id: 'period-2024-q3', year: 2024, quarter: 3, label: 'Q3/2024', startDate: '2024-07-01', endDate: '2024-09-30', isActive: false },
  { id: 'period-2024-q4', year: 2024, quarter: 4, label: 'Q4/2024', startDate: '2024-10-01', endDate: '2024-12-31', isActive: true },
  { id: 'period-2025-q1', year: 2025, quarter: 1, label: 'Q1/2025', startDate: '2025-01-01', endDate: '2025-03-31', isActive: false },
]

export const useAdminStore = create((set) => ({
  company: {
    id: 'cty-001',
    name: 'Công ty CP Thiên Phú',
    shortName: 'Thiên Phú',
    taxCode: '0123456789',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    phone: '028 1234 5678',
    email: 'info@thienphu.vn',
    website: 'www.thienphu.vn',
    industry: 'manufacturing',
    fiscalYearStart: 1,
    currentYear: 2024,
  },
  departments: [...mockDepartments],
  users: [...mockUsers],
  periods: [...DEFAULT_PERIODS],
  ratingThresholds: { excellent: 110, good: 90, average: 70 },

  // Company
  updateCompany: (changes) => set((s) => ({ company: { ...s.company, ...changes } })),

  // Departments
  addDept: (dept) =>
    set((s) => ({ departments: [...s.departments, { id: `dept-new-${++nextId}`, ...dept }] })),
  updateDept: (id, changes) =>
    set((s) => ({ departments: s.departments.map((d) => (d.id === id ? { ...d, ...changes } : d)) })),
  deleteDept: (id) =>
    set((s) => ({ departments: s.departments.filter((d) => d.id !== id) })),

  // Users
  addUser: (user) =>
    set((s) => ({ users: [...s.users, { id: `usr-new-${++nextId}`, ...user }] })),
  updateUser: (id, changes) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...changes } : u)) })),
  deleteUser: (id) =>
    set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

  // Periods
  addPeriod: (period) =>
    set((s) => ({ periods: [...s.periods, { id: `period-new-${++nextId}`, isActive: false, ...period }] })),
  updatePeriod: (id, changes) =>
    set((s) => ({ periods: s.periods.map((p) => (p.id === id ? { ...p, ...changes } : p)) })),
  deletePeriod: (id) =>
    set((s) => ({ periods: s.periods.filter((p) => p.id !== id) })),
  setActivePeriod: (id) =>
    set((s) => ({ periods: s.periods.map((p) => ({ ...p, isActive: p.id === id })) })),

  // Rating Thresholds
  updateRatingThresholds: (t) =>
    set((s) => ({ ratingThresholds: { ...s.ratingThresholds, ...t } })),
}))
