import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const ADMIN_ACCOUNT = {
  id: 'admin-root',
  username: 'admin',
  password: 'admin123',
  name: 'Quản trị viên',
  email: 'admin@thienphu.vn',
  avatar: 'AD',
}

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      admin: null,

      login: (username, password) => {
        if (
          username.trim() === ADMIN_ACCOUNT.username &&
          password === ADMIN_ACCOUNT.password
        ) {
          const { password: _pw, ...safe } = ADMIN_ACCOUNT
          set({ admin: safe })
          return true
        }
        return false
      },

      logout: () => set({ admin: null }),
    }),
    {
      name: 'skillforge-admin-auth',
      partialize: (s) => ({ admin: s.admin }),
    }
  )
)
