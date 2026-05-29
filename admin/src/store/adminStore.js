import { create } from 'zustand'
import { mockDepartments } from '../data/mockDepartments.js'
import { mockUsers } from '../data/mockUsers.js'

let nextId = 1000

export const useAdminStore = create(set => ({
  company: { id: 'cty-001', name: 'Công ty CP Thiên Phú', fiscalYearStart: 1, currentYear: 2024 },
  departments: [...mockDepartments],
  users: [...mockUsers],
  ratingThresholds: { excellent: 110, good: 90, average: 70 },

  updateCompany: changes => set(s => ({ company: { ...s.company, ...changes } })),

  addDept: dept => set(s => ({ departments: [...s.departments, { id: `dept-new-${++nextId}`, ...dept }] })),
  updateDept: (id, changes) => set(s => ({ departments: s.departments.map(d => d.id === id ? { ...d, ...changes } : d) })),
  deleteDept: id => set(s => ({ departments: s.departments.filter(d => d.id !== id) })),

  addUser: user => set(s => ({ users: [...s.users, { id: `usr-new-${++nextId}`, ...user }] })),
  updateUser: (id, changes) => set(s => ({ users: s.users.map(u => u.id === id ? { ...u, ...changes } : u) })),
  deleteUser: id => set(s => ({ users: s.users.filter(u => u.id !== id) })),

  updateRatingThresholds: t => set(s => ({ ratingThresholds: { ...s.ratingThresholds, ...t } })),
}))
