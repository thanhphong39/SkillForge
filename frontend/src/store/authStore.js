import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const ROLES = {
  CEO:       { id: 'CEO',       label: 'Giám đốc',          color: '#7c3aed' },
  DEPT_HEAD: { id: 'DEPT_HEAD', label: 'Trưởng phòng',      color: '#2563eb' },
  EMPLOYEE:  { id: 'EMPLOYEE',  label: 'Nhân viên',         color: '#16a34a' },
}

// Demo accounts — mật khẩu đều là 123456
export const MOCK_USERS = [
  {
    id: 'usr-ceo',
    username: 'ceo',
    password: '123456',
    name: 'Nguyễn Thành Công',
    role: 'CEO',
    title: 'Giám đốc điều hành',
    avatar: 'NC',
    deptId: null,
    deptName: null,
  },
  {
    id: 'usr-tp-hr',
    username: 'tp.hr',
    password: '123456',
    name: 'Phạm Thị Bình',
    role: 'DEPT_HEAD',
    title: 'Trưởng phòng Nhân sự',
    avatar: 'PB',
    deptId: 'dept-hr',
    deptName: 'Nhân sự (HR)',
  },
  {
    id: 'usr-tp-sales',
    username: 'tp.sales',
    password: '123456',
    name: 'Trần Văn Cường',
    role: 'DEPT_HEAD',
    title: 'Trưởng phòng Kinh doanh',
    avatar: 'TC',
    deptId: 'dept-sales',
    deptName: 'Kinh doanh (Sales)',
  },
  {
    id: 'usr-tp-mkt',
    username: 'tp.mkt',
    password: '123456',
    name: 'Hoàng Thị Dung',
    role: 'DEPT_HEAD',
    title: 'Trưởng phòng Marketing',
    avatar: 'HD',
    deptId: 'dept-mkt',
    deptName: 'Marketing',
  },
  {
    id: 'usr-nv-1',
    username: 'nv.it',
    password: '123456',
    name: 'Ngô Thị Hạnh',
    role: 'EMPLOYEE',
    title: 'Nhân viên IT',
    avatar: 'NH',
    deptId: 'dept-it',
    deptName: 'IT',
  },
  {
    id: 'usr-nv-2',
    username: 'nv.ops',
    password: '123456',
    name: 'Đặng Văn Giang',
    role: 'EMPLOYEE',
    title: 'Nhân viên Vận hành',
    avatar: 'DG',
    deptId: 'dept-ops',
    deptName: 'Vận hành (Ops)',
  },
]

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      login: (username, password) => {
        const found = MOCK_USERS.find(
          (u) => u.username === username.trim()
        ) ?? MOCK_USERS[0]
        const { password: _pw, ...safeUser } = found
        set({ user: safeUser })
        return true
      },

      logout: () => set({ user: null }),
    }),
    {
      name: 'skillforge-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
