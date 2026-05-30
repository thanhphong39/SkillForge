// Strategy 1: Market expansion & revenue growth
const strategy1Objectives = [
  { id: 's1-f1', perspective: 'financial', title: 'Tăng trưởng doanh thu', description: 'Đạt tăng trưởng doanh thu 25% so với năm trước', position: { x: 80, y: 720 }, kpiIds: ['kpi-f1', 'kpi-f2'] },
  { id: 's1-f2', perspective: 'financial', title: 'Cải thiện lợi nhuận', description: 'Đạt tỷ lệ lợi nhuận ròng ≥ 15%', position: { x: 400, y: 720 }, kpiIds: ['kpi-f3'] },
  { id: 's1-f3', perspective: 'financial', title: 'Kiểm soát chi phí', description: 'Giảm chi phí hoạt động 10% YoY', position: { x: 720, y: 720 }, kpiIds: ['kpi-f4'] },

  { id: 's1-c1', perspective: 'customer', title: 'Tăng sự hài lòng khách hàng', description: 'Đạt điểm NPS ≥ 50', position: { x: 80, y: 500 }, kpiIds: ['kpi-c1'] },
  { id: 's1-c2', perspective: 'customer', title: 'Mở rộng thị phần', description: 'Tăng thị phần thêm 5% trong năm', position: { x: 400, y: 500 }, kpiIds: ['kpi-c2', 'kpi-c3'] },
  { id: 's1-c3', perspective: 'customer', title: 'Giữ chân khách hàng', description: 'Tỷ lệ giữ khách ≥ 85%', position: { x: 720, y: 500 }, kpiIds: ['kpi-c4'] },

  { id: 's1-i1', perspective: 'internal', title: 'Tối ưu quy trình sản xuất', description: 'Giảm thời gian sản xuất 15%', position: { x: 80, y: 280 }, kpiIds: ['kpi-i1', 'kpi-i2'] },
  { id: 's1-i2', perspective: 'internal', title: 'Nâng cao chất lượng sản phẩm', description: 'Tỷ lệ lỗi < 2%', position: { x: 400, y: 280 }, kpiIds: ['kpi-i3'] },
  { id: 's1-i3', perspective: 'internal', title: 'Phát triển kênh phân phối mới', description: 'Mở thêm 3 kênh phân phối trong năm', position: { x: 720, y: 280 }, kpiIds: ['kpi-i4'] },

  { id: 's1-l1', perspective: 'learning', title: 'Phát triển năng lực nhân viên', description: 'Mỗi nhân viên hoàn thành ≥ 40 giờ đào tạo/năm', position: { x: 80, y: 60 }, kpiIds: ['kpi-l1', 'kpi-l2'] },
  { id: 's1-l2', perspective: 'learning', title: 'Xây dựng văn hóa bán hàng', description: 'Tăng chỉ số engagement nhân viên bán hàng lên 80%', position: { x: 400, y: 60 }, kpiIds: ['kpi-l3'] },
  { id: 's1-l3', perspective: 'learning', title: 'Thu hút & giữ nhân tài', description: 'Tỷ lệ nghỉ việc < 12%', position: { x: 720, y: 60 }, kpiIds: ['kpi-l4'] },
]

const strategy1Links = [
  { id: 's1-l1-i1', sourceId: 's1-l1', targetId: 's1-i1', label: 'Nâng cao kỹ năng' },
  { id: 's1-l1-i2', sourceId: 's1-l1', targetId: 's1-i2', label: 'Cải thiện chất lượng' },
  { id: 's1-l3-i3', sourceId: 's1-l3', targetId: 's1-i3', label: 'Nhân tài mở kênh mới' },
  { id: 's1-i1-c1', sourceId: 's1-i1', targetId: 's1-c1', label: 'Giao hàng nhanh hơn' },
  { id: 's1-i2-c1', sourceId: 's1-i2', targetId: 's1-c1', label: 'Sản phẩm tốt hơn' },
  { id: 's1-i3-c2', sourceId: 's1-i3', targetId: 's1-c2', label: 'Kênh mới tăng thị phần' },
  { id: 's1-c1-f1', sourceId: 's1-c1', targetId: 's1-f1', label: 'Mua lại & giới thiệu' },
  { id: 's1-c2-f1', sourceId: 's1-c2', targetId: 's1-f1', label: 'Tăng doanh số' },
  { id: 's1-c3-f2', sourceId: 's1-c3', targetId: 's1-f2', label: 'Giảm chi phí thu hút' },
]

// Strategy 2: Digital transformation & cost optimization
const strategy2Objectives = [
  { id: 's2-f1', perspective: 'financial', title: 'Tối ưu hóa chi phí vận hành', description: 'Giảm chi phí vận hành 20% qua tự động hóa', position: { x: 80, y: 720 }, kpiIds: ['kpi-f4'] },
  { id: 's2-f2', perspective: 'financial', title: 'Tăng biên lợi nhuận', description: 'Cải thiện gross margin lên ≥ 40%', position: { x: 400, y: 720 }, kpiIds: ['kpi-f3'] },
  { id: 's2-f3', perspective: 'financial', title: 'Đầu tư vào công nghệ', description: 'Phân bổ 8% doanh thu cho R&D và công nghệ', position: { x: 720, y: 720 }, kpiIds: ['kpi-f1'] },

  { id: 's2-c1', perspective: 'customer', title: 'Nâng cao trải nghiệm số', description: 'Đạt điểm CSAT ≥ 4.5/5 cho kênh số', position: { x: 80, y: 500 }, kpiIds: ['kpi-c1'] },
  { id: 's2-c2', perspective: 'customer', title: 'Dịch vụ 24/7 tự động', description: 'Tự động hóa 70% yêu cầu hỗ trợ khách hàng', position: { x: 400, y: 500 }, kpiIds: ['kpi-c2'] },
  { id: 's2-c3', perspective: 'customer', title: 'Cá nhân hóa dịch vụ', description: 'Tỷ lệ chuyển đổi từ đề xuất cá nhân ≥ 25%', position: { x: 720, y: 500 }, kpiIds: ['kpi-c4'] },

  { id: 's2-i1', perspective: 'internal', title: 'Chuyển đổi số quy trình', description: 'Tự động hóa 60% quy trình lặp lại', position: { x: 80, y: 280 }, kpiIds: ['kpi-i4'] },
  { id: 's2-i2', perspective: 'internal', title: 'Tích hợp ERP/CRM', description: 'Hoàn thành tích hợp 100% hệ thống quản lý', position: { x: 400, y: 280 }, kpiIds: ['kpi-i3'] },
  { id: 's2-i3', perspective: 'internal', title: 'Bảo mật & quản trị dữ liệu', description: 'Đạt chứng nhận ISO 27001', position: { x: 720, y: 280 }, kpiIds: ['kpi-i2'] },

  { id: 's2-l1', perspective: 'learning', title: 'Nâng cao năng lực số', description: 'Toàn bộ nhân viên đạt chứng chỉ số cơ bản', position: { x: 80, y: 60 }, kpiIds: ['kpi-l1'] },
  { id: 's2-l2', perspective: 'learning', title: 'Xây dựng văn hóa đổi mới', description: 'Đề xuất sáng kiến từ nhân viên ≥ 20 ý tưởng/quý', position: { x: 400, y: 60 }, kpiIds: ['kpi-l3'] },
  { id: 's2-l3', perspective: 'learning', title: 'Tuyển dụng chuyên gia công nghệ', description: 'Bổ sung 20 nhân sự IT/Data trong năm', position: { x: 720, y: 60 }, kpiIds: ['kpi-l4'] },
]

const strategy2Links = [
  { id: 's2-l1-i1', sourceId: 's2-l1', targetId: 's2-i1', label: 'Năng lực số hóa' },
  { id: 's2-l2-i1', sourceId: 's2-l2', targetId: 's2-i1', label: 'Sáng kiến tự động hóa' },
  { id: 's2-l3-i2', sourceId: 's2-l3', targetId: 's2-i2', label: 'Chuyên gia tích hợp' },
  { id: 's2-i1-c1', sourceId: 's2-i1', targetId: 's2-c1', label: 'Trải nghiệm số tốt hơn' },
  { id: 's2-i1-c2', sourceId: 's2-i1', targetId: 's2-c2', label: 'Tự động hóa hỗ trợ' },
  { id: 's2-i2-c3', sourceId: 's2-i2', targetId: 's2-c3', label: 'Dữ liệu cá nhân hóa' },
  { id: 's2-i3-c1', sourceId: 's2-i3', targetId: 's2-c1', label: 'Bảo mật tăng tin cậy' },
  { id: 's2-c1-f1', sourceId: 's2-c1', targetId: 's2-f1', label: 'Giảm chi phí dịch vụ' },
  { id: 's2-c2-f1', sourceId: 's2-c2', targetId: 's2-f1', label: 'Tự động hóa giảm chi phí' },
  { id: 's2-i1-f1', sourceId: 's2-i1', targetId: 's2-f1', label: 'Quy trình tinh gọn' },
  { id: 's2-c3-f2', sourceId: 's2-c3', targetId: 's2-f2', label: 'Upsell & cross-sell' },
]

export const mockStrategySets = [
  {
    id: 'strategy-1',
    name: 'Chiến lược 1',
    description: 'Mở rộng thị trường và phát triển doanh thu',
    color: '#2563eb',
    objectives: strategy1Objectives,
    links: strategy1Links,
  },
  {
    id: 'strategy-2',
    name: 'Chiến lược 2',
    description: 'Chuyển đổi số và tối ưu hóa chi phí',
    color: '#9333ea',
    objectives: strategy2Objectives,
    links: strategy2Links,
  },
]

// Backwards-compatible flat exports
export const mockStrategicObjectives = [...strategy1Objectives, ...strategy2Objectives]
export const mockStrategicLinks = [...strategy1Links, ...strategy2Links]
export const OBJ_MAP = Object.fromEntries(mockStrategicObjectives.map(o => [o.id, o]))
