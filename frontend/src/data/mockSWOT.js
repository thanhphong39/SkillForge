export const mockSWOTItems = [
  // Strengths
  { id: 'sw-s1', quadrant: 'strength', title: 'Thương hiệu mạnh trong khu vực', description: 'Được nhận diện bởi 73% khách hàng mục tiêu tại thị trường miền Nam', impact: 'high', category: 'brand' },
  { id: 'sw-s2', quadrant: 'strength', title: 'Đội ngũ kỹ thuật giàu kinh nghiệm', description: 'Trung bình 8 năm kinh nghiệm, 60% có bằng đại học kỹ thuật', impact: 'high', category: 'people' },
  { id: 'sw-s3', quadrant: 'strength', title: 'Chuỗi cung ứng ổn định', description: '5 nhà cung cấp chiến lược với hợp đồng dài hạn, ít rủi ro gián đoạn', impact: 'medium', category: 'operations' },
  { id: 'sw-s4', quadrant: 'strength', title: 'Cơ cấu chi phí cạnh tranh', description: 'Chi phí sản xuất thấp hơn 12% so với trung bình ngành', impact: 'medium', category: 'finance' },

  // Weaknesses
  { id: 'sw-w1', quadrant: 'weakness', title: 'Chưa chuyển đổi số', description: 'Nhiều quy trình vẫn thủ công, thiếu tích hợp hệ thống ERP/CRM', impact: 'high', category: 'technology' },
  { id: 'sw-w2', quadrant: 'weakness', title: 'Danh mục sản phẩm hạn hẹp', description: 'Chỉ có 3 dòng sản phẩm chính, dễ bị tổn thương nếu nhu cầu thay đổi', impact: 'high', category: 'product' },
  { id: 'sw-w3', quadrant: 'weakness', title: 'Tỷ lệ nghỉ việc cao', description: 'Turnover 22%/năm, cao hơn trung bình ngành 15%, chi phí tuyển dụng lớn', impact: 'medium', category: 'people' },
  { id: 'sw-w4', quadrant: 'weakness', title: 'Báo cáo quản trị thủ công', description: 'Thiếu dashboard thời gian thực, quyết định chậm do thiếu dữ liệu kịp thời', impact: 'medium', category: 'operations' },

  // Opportunities
  { id: 'sw-o1', quadrant: 'opportunity', title: 'Thương mại điện tử tăng trưởng mạnh', description: 'Kênh online tăng 35%/năm, cơ hội mở rộng doanh thu không cần mặt bằng', impact: 'high', category: 'market' },
  { id: 'sw-o2', quadrant: 'opportunity', title: 'Đầu tư hạ tầng chính phủ', description: 'Gói đầu tư công 2024-2026 tạo nhu cầu lớn cho vật liệu xây dựng', impact: 'high', category: 'market' },
  { id: 'sw-o3', quadrant: 'opportunity', title: 'Mở rộng ra khu vực miền Trung', description: 'Thị trường chưa khai thác, ít đối thủ mạnh, biên lợi nhuận cao hơn', impact: 'medium', category: 'expansion' },
  { id: 'sw-o4', quadrant: 'opportunity', title: 'Xu hướng ESG và sản phẩm xanh', description: 'Nhu cầu sản phẩm thân thiện môi trường tăng, premium pricing tiềm năng', impact: 'medium', category: 'product' },

  // Threats
  { id: 'sw-t1', quadrant: 'threat', title: 'Biến động giá nguyên vật liệu', description: 'Giá thép và xi măng tăng 25% trong 18 tháng, ảnh hưởng biên lợi nhuận', impact: 'high', category: 'supply' },
  { id: 'sw-t2', quadrant: 'threat', title: 'Đối thủ mới từ Trung Quốc', description: 'Hàng nhập khẩu giá rẻ chiếm 15% thị phần trong 2 năm gần đây', impact: 'high', category: 'competition' },
  { id: 'sw-t3', quadrant: 'threat', title: 'Biến động tỷ giá', description: 'Phụ thuộc 30% nguyên liệu nhập khẩu, rủi ro tỷ giá USD/VND', impact: 'medium', category: 'finance' },
  { id: 'sw-t4', quadrant: 'threat', title: 'Thắt chặt quy định môi trường', description: 'Các tiêu chuẩn phát thải mới yêu cầu đầu tư thiết bị lọc thêm', impact: 'medium', category: 'regulation' },
]

export const mockStrategies = [
  {
    id: 'strat-so1', type: 'SO', priority: 'high', selected: true,
    title: 'Mở rộng thị phần khu vực miền Trung',
    description: 'Tận dụng thương hiệu mạnh và chuỗi cung ứng ổn định để xâm nhập thị trường miền Trung chưa khai thác',
    relatedStrengths: ['sw-s1', 'sw-s3'],
    relatedOpportunities: ['sw-o3'],
    relatedWeaknesses: [], relatedThreats: [],
    feasibility: 75, impact: 85,
  },
  {
    id: 'strat-so2', type: 'SO', priority: 'high', selected: true,
    title: 'Phát triển kênh bán hàng trực tuyến',
    description: 'Dùng lợi thế thương hiệu và cơ cấu chi phí thấp để xây dựng kênh thương mại điện tử B2B',
    relatedStrengths: ['sw-s1', 'sw-s4'],
    relatedOpportunities: ['sw-o1'],
    relatedWeaknesses: [], relatedThreats: [],
    feasibility: 65, impact: 80,
  },
  {
    id: 'strat-st1', type: 'ST', priority: 'high', selected: true,
    title: 'Đa dạng hóa nhà cung cấp nội địa',
    description: 'Phát triển thêm nhà cung cấp trong nước để giảm phụ thuộc nguyên liệu nhập khẩu và rủi ro tỷ giá',
    relatedStrengths: ['sw-s3'],
    relatedThreats: ['sw-t1', 'sw-t3'],
    relatedWeaknesses: [], relatedOpportunities: [],
    feasibility: 70, impact: 70,
  },
  {
    id: 'strat-st2', type: 'ST', priority: 'medium', selected: false,
    title: 'Phát triển dòng sản phẩm cao cấp',
    description: 'Dùng lợi thế kỹ thuật để phát triển sản phẩm premium, tránh cạnh tranh giá với hàng Trung Quốc',
    relatedStrengths: ['sw-s2', 'sw-s4'],
    relatedThreats: ['sw-t2'],
    relatedWeaknesses: [], relatedOpportunities: [],
    feasibility: 55, impact: 75,
  },
  {
    id: 'strat-wo1', type: 'WO', priority: 'high', selected: true,
    title: 'Chuyển đổi số quy trình vận hành',
    description: 'Triển khai ERP và CRM để tận dụng cơ hội thị trường nhanh hơn, giảm chi phí vận hành thủ công',
    relatedWeaknesses: ['sw-w1', 'sw-w4'],
    relatedOpportunities: ['sw-o1'],
    relatedStrengths: [], relatedThreats: [],
    feasibility: 60, impact: 85,
  },
  {
    id: 'strat-wo2', type: 'WO', priority: 'medium', selected: false,
    title: 'Mở rộng danh mục sản phẩm xanh',
    description: 'Nghiên cứu và phát triển dòng sản phẩm thân thiện môi trường để đáp ứng xu hướng ESG',
    relatedWeaknesses: ['sw-w2'],
    relatedOpportunities: ['sw-o4'],
    relatedStrengths: [], relatedThreats: [],
    feasibility: 45, impact: 70,
  },
  {
    id: 'strat-wt1', type: 'WT', priority: 'medium', selected: false,
    title: 'Cải thiện chính sách giữ chân nhân tài',
    description: 'Xây dựng lộ trình nghề nghiệp và gói phúc lợi cạnh tranh để giảm turnover, tăng sức chống chịu',
    relatedWeaknesses: ['sw-w3'],
    relatedThreats: ['sw-t2'],
    relatedStrengths: [], relatedOpportunities: [],
    feasibility: 70, impact: 60,
  },
  {
    id: 'strat-wt2', type: 'WT', priority: 'low', selected: false,
    title: 'Tối ưu hóa chi phí vận hành',
    description: 'Lean manufacturing và tự động hóa một phần để duy trì khả năng cạnh tranh khi chi phí tăng',
    relatedWeaknesses: ['sw-w1'],
    relatedThreats: ['sw-t1'],
    relatedStrengths: [], relatedOpportunities: [],
    feasibility: 65, impact: 55,
  },
]
