import { create } from 'zustand'
import {
  mockFinancial,
  mockMarketShareCurrent,
  mockMarketShareFuture,
  mockCurrentSegments,
  mockFutureSegments,
  mockCurrentProducts,
  mockFutureProducts,
  mockCompanyStrengths,
  mockIndustrySuccessFactors,
  mockCompetitorStrengths,
  mockCompetitorWeaknesses,
  mockCompetitiveAdvantages,
} from '../data/mockAssessment.js'

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

const cloneList = (list) => list.map((r) => ({ ...r }))

export const useAssessmentStore = create((set, get) => ({
  financial: cloneList(mockFinancial),
  marketShareCurrent: cloneList(mockMarketShareCurrent),
  marketShareFuture: cloneList(mockMarketShareFuture),
  currentSegments: cloneList(mockCurrentSegments),
  futureSegments: cloneList(mockFutureSegments),
  currentProducts: cloneList(mockCurrentProducts),
  futureProducts: cloneList(mockFutureProducts),
  companyStrengths: cloneList(mockCompanyStrengths),
  industrySuccessFactors: cloneList(mockIndustrySuccessFactors),
  competitorStrengths: cloneList(mockCompetitorStrengths),
  competitorWeaknesses: cloneList(mockCompetitorWeaknesses),
  competitiveAdvantages: cloneList(mockCompetitiveAdvantages),

  // Financial
  addFinancialYear: (year, revenue, profit) => set((state) => ({
    financial: [...state.financial, { id: uid(), year: Number(year), revenue: Number(revenue), profit: Number(profit) }],
  })),
  updateFinancialYear: (id, changes) => set((state) => ({
    financial: state.financial.map((r) => r.id === id ? { ...r, ...changes } : r),
  })),
  removeFinancialYear: (id) => set((state) => ({
    financial: state.financial.filter((r) => r.id !== id),
  })),

  // Market share
  addMarketShareEntry: (type, entry) => set((state) => {
    const key = type === 'current' ? 'marketShareCurrent' : 'marketShareFuture'
    return { [key]: [...state[key], { id: uid(), name: '', percentage: 0, isOwn: false, ...entry }] }
  }),
  updateMarketShareEntry: (type, id, changes) => set((state) => {
    const key = type === 'current' ? 'marketShareCurrent' : 'marketShareFuture'
    return { [key]: state[key].map((r) => r.id === id ? { ...r, ...changes } : r) }
  }),
  removeMarketShareEntry: (type, id) => set((state) => {
    const key = type === 'current' ? 'marketShareCurrent' : 'marketShareFuture'
    return { [key]: state[key].filter((r) => r.id !== id) }
  }),

  // Generic text lists
  // field: 'currentSegments' | 'futureSegments' | 'currentProducts' | 'futureProducts'
  //        | 'companyStrengths' | 'industrySuccessFactors' | 'competitorStrengths'
  //        | 'competitorWeaknesses' | 'competitiveAdvantages'
  addListItem: (field, value) => set((state) => ({
    [field]: [...state[field], { id: uid(), value: value.trim() }],
  })),
  updateListItem: (field, id, value) => set((state) => ({
    [field]: state[field].map((r) => r.id === id ? { ...r, value: value.trim() } : r),
  })),
  removeListItem: (field, id) => set((state) => ({
    [field]: state[field].filter((r) => r.id !== id),
  })),

  validate: () => {
    const s = get()
    const errors = []

    if (s.financial.length === 0) errors.push('Phần tài chính cần ít nhất 1 năm dữ liệu')
    if (s.financial.length > 3) errors.push('Phần tài chính không được vượt quá 3 năm')
    s.financial.forEach((r) => {
      if (r.revenue < 0) errors.push(`Năm ${r.year}: doanh thu không được âm`)
    })

    const totalCurrent = s.marketShareCurrent.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0)
    if (!s.marketShareCurrent.some((r) => r.isOwn)) errors.push('Thị phần hiện tại: cần đánh dấu công ty của mình')
    if (Math.abs(totalCurrent - 100) > 0.01) errors.push(`Tổng thị phần hiện tại = ${totalCurrent}% (cần bằng 100%)`)

    const totalFuture = s.marketShareFuture.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0)
    if (!s.marketShareFuture.some((r) => r.isOwn)) errors.push('Thị phần tương lai: cần đánh dấu công ty của mình')
    if (Math.abs(totalFuture - 100) > 0.01) errors.push(`Tổng thị phần tương lai = ${totalFuture}% (cần bằng 100%)`)

    const requiredLists = [
      ['currentSegments', 'Phân khúc hiện tại'],
      ['futureSegments', 'Phân khúc tương lai'],
      ['currentProducts', 'Sản phẩm chủ lực hiện tại'],
      ['futureProducts', 'Sản phẩm chủ lực tương lai'],
      ['companyStrengths', 'Điểm mạnh công ty'],
      ['industrySuccessFactors', 'Yếu tố thành công trong ngành'],
      ['competitorStrengths', 'Điểm mạnh đối thủ'],
      ['competitorWeaknesses', 'Điểm yếu đối thủ'],
      ['competitiveAdvantages', 'Lợi thế cạnh tranh'],
    ]
    requiredLists.forEach(([field, label]) => {
      if (s[field].length === 0) errors.push(`${label}: cần ít nhất 1 mục`)
    })

    return errors
  },
}))
