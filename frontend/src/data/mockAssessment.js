export const mockCompanyProfile = {
  name: 'Công ty CP Thiên Phú',
  shortName: 'Thiên Phú',
  industry: 'Sản xuất & Thương mại',
  foundedYear: 2010,
  employeeCount: 120,
  annualRevenue: '85 tỷ đồng',
  website: 'thienphu.vn',
  currentChallenges: [
    'Tăng trưởng doanh thu chậm lại',
    'Cạnh tranh ngày càng tăng',
    'Chi phí vận hành cao',
  ],
  bscExperience: 'none',
  deploymentGoal: 'Xây dựng hệ thống đo lường hiệu suất toàn diện và liên kết chiến lược với hoạt động hàng ngày',
}

export const mockReadinessChecklist = [
  // Leadership
  { id: 'r1', category: 'leadership', label: 'Ban lãnh đạo cam kết triển khai BSC', description: 'CEO và Ban giám đốc đã phê duyệt dự án BSC', checked: true },
  { id: 'r2', category: 'leadership', label: 'Có người chịu trách nhiệm dự án BSC', description: 'Đã phân công Project Owner và BSC Champion', checked: true },
  { id: 'r3', category: 'leadership', label: 'Chiến lược công ty đã được xác định rõ', description: 'Tầm nhìn, sứ mệnh và định hướng chiến lược được tài liệu hóa', checked: false },
  // Data
  { id: 'r4', category: 'data', label: 'Có hệ thống thu thập dữ liệu KPI', description: 'Phần mềm hoặc quy trình thu thập số liệu định kỳ', checked: false },
  { id: 'r5', category: 'data', label: 'Dữ liệu tài chính được báo cáo đầy đủ', description: 'Báo cáo P&L, bảng cân đối kế toán được cập nhật hàng tháng', checked: true },
  { id: 'r6', category: 'data', label: 'Có dữ liệu khảo sát khách hàng', description: 'NPS, CSAT hoặc số liệu đánh giá sự hài lòng khách hàng', checked: false },
  // Process
  { id: 'r7', category: 'process', label: 'Quy trình nội bộ chính được tài liệu hóa', description: 'Flowchart hoặc SOP cho các quy trình cốt lõi', checked: true },
  { id: 'r8', category: 'process', label: 'Có quy trình đánh giá hiệu suất nhân viên', description: 'Review kỳ hàng quý hoặc hàng năm đang được thực hiện', checked: true },
  { id: 'r9', category: 'process', label: 'Ngân sách và kế hoạch hàng năm được phê duyệt', description: 'Business plan cho năm hiện tại đã có và được duyệt', checked: false },
  // Culture
  { id: 'r10', category: 'culture', label: 'Nhân viên hiểu tầm quan trọng của KPI', description: 'Nhân viên biết KPI của mình và hiểu ý nghĩa', checked: false },
  { id: 'r11', category: 'culture', label: 'Văn hóa chia sẻ thông tin minh bạch', description: 'Dữ liệu hiệu suất được chia sẻ rộng rãi trong tổ chức', checked: false },
  { id: 'r12', category: 'culture', label: 'Quản lý cấp trung ủng hộ thay đổi', description: 'Các trưởng phòng/bộ phận đồng thuận với việc triển khai BSC', checked: true },
]

export const mockFinancialSnapshot = {
  years: ['2022', '2023', '2024'],
  revenue: [62, 74, 85],
  profit: [7.4, 10.4, 10.4],
  headcount: [98, 108, 120],
  growthRate: 14.9,
  profitMargin: 12.3,
  revenuePerEmployee: 0.71,
}
