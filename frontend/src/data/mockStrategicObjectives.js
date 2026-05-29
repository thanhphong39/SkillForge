export const mockStrategicObjectives = [
  // Tài chính
  { id: 'so-f1', perspective: 'financial', title: 'Tăng trưởng doanh thu', description: 'Đạt tăng trưởng doanh thu 25% so với năm trước', position: { x: 80, y: 720 }, kpiIds: ['kpi-f1', 'kpi-f2'] },
  { id: 'so-f2', perspective: 'financial', title: 'Cải thiện lợi nhuận', description: 'Đạt tỷ lệ lợi nhuận ròng ≥ 15%', position: { x: 400, y: 720 }, kpiIds: ['kpi-f3'] },
  { id: 'so-f3', perspective: 'financial', title: 'Kiểm soát chi phí', description: 'Giảm chi phí hoạt động 10% YoY', position: { x: 720, y: 720 }, kpiIds: ['kpi-f4'] },

  // Khách hàng
  { id: 'so-c1', perspective: 'customer', title: 'Tăng sự hài lòng khách hàng', description: 'Đạt điểm NPS ≥ 50', position: { x: 80, y: 500 }, kpiIds: ['kpi-c1'] },
  { id: 'so-c2', perspective: 'customer', title: 'Mở rộng thị phần', description: 'Tăng thị phần thêm 5% trong năm', position: { x: 400, y: 500 }, kpiIds: ['kpi-c2', 'kpi-c3'] },
  { id: 'so-c3', perspective: 'customer', title: 'Giữ chân khách hàng', description: 'Tỷ lệ giữ khách ≥ 85%', position: { x: 720, y: 500 }, kpiIds: ['kpi-c4'] },

  // Quy trình nội bộ
  { id: 'so-i1', perspective: 'internal', title: 'Tối ưu quy trình sản xuất', description: 'Giảm thời gian sản xuất 15%', position: { x: 80, y: 280 }, kpiIds: ['kpi-i1', 'kpi-i2'] },
  { id: 'so-i2', perspective: 'internal', title: 'Nâng cao chất lượng sản phẩm', description: 'Tỷ lệ lỗi < 2%', position: { x: 400, y: 280 }, kpiIds: ['kpi-i3'] },
  { id: 'so-i3', perspective: 'internal', title: 'Chuyển đổi số quy trình', description: 'Tự động hóa 60% quy trình lặp lại', position: { x: 720, y: 280 }, kpiIds: ['kpi-i4'] },

  // Học hỏi & Phát triển
  { id: 'so-l1', perspective: 'learning', title: 'Phát triển năng lực nhân viên', description: 'Mỗi nhân viên hoàn thành ≥ 40 giờ đào tạo/năm', position: { x: 80, y: 60 }, kpiIds: ['kpi-l1', 'kpi-l2'] },
  { id: 'so-l2', perspective: 'learning', title: 'Xây dựng văn hóa đổi mới', description: 'Đề xuất sáng kiến từ nhân viên ≥ 20 ý tưởng/quý', position: { x: 400, y: 60 }, kpiIds: ['kpi-l3'] },
  { id: 'so-l3', perspective: 'learning', title: 'Thu hút & giữ nhân tài', description: 'Tỷ lệ nghỉ việc < 12%', position: { x: 720, y: 60 }, kpiIds: ['kpi-l4'] },
]

export const OBJ_MAP = Object.fromEntries(mockStrategicObjectives.map(o => [o.id, o]))
