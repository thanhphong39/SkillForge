const uid = (prefix) => (n) => `${prefix}-${n}`
const s7 = uid('7s')
const ff = uid('ff')
const pe = uid('pe')

export const mockSevenS = {
  STRATEGY: [
    { id: s7(1), value: 'Tập trung vào phân khúc SME chuyển đổi số' },
    { id: s7(2), value: 'Mở rộng thị trường sang các tỉnh ngoài TP.HCM' },
  ],
  STRUCTURE: [
    { id: s7(3), value: 'Cơ cấu tổ chức phẳng, linh hoạt theo dự án' },
    { id: s7(4), value: 'Phối hợp liên phòng ban còn nhiều hạn chế' },
  ],
  SYSTEMS: [
    { id: s7(5), value: 'Quy trình triển khai dự án được tài liệu hóa rõ ràng' },
    { id: s7(6), value: 'Hệ thống CRM chưa đồng bộ với bộ phận sales' },
  ],
  SHARED_VALUES: [
    { id: s7(7), value: 'Văn hóa chú trọng kết quả đo lường được' },
    { id: s7(8), value: 'Đề cao sự minh bạch trong báo cáo nội bộ' },
  ],
  SKILLS: [
    { id: s7(9),  value: 'Đội ngũ kỹ thuật triển khai nhanh và thành thạo' },
    { id: s7(10), value: 'Nhân viên sales chưa mạnh về tư vấn giải pháp chiến lược' },
    { id: s7(11), value: 'Bộ phận CSKH có kinh nghiệm xử lý khách hàng SME' },
  ],
  STYLE: [
    { id: s7(12), value: 'Lãnh đạo chủ động, trao quyền cho đội nhóm' },
    { id: s7(13), value: 'Ra quyết định nhanh nhờ cơ cấu gọn' },
  ],
  STAFF: [
    { id: s7(14), value: 'Đội ngũ trẻ, nhiệt huyết và học hỏi nhanh' },
    { id: s7(15), value: 'Tỷ lệ giữ chân nhân sự chủ chốt còn thấp' },
  ],
}

export const mockFiveForces = {
  COMPETITIVE_RIVALRY: [
    { id: ff(1), value: 'Nhiều đối thủ đang cung cấp giải pháp BSC/KPI tương tự' },
    { id: ff(2), value: 'Một số đối thủ cạnh tranh bằng giá thấp hơn đáng kể' },
    { id: ff(3), value: 'Thị trường SME còn phân mảnh, chưa có đơn vị thống trị tuyệt đối' },
  ],
  SUPPLIER_POWER: [
    { id: ff(4), value: 'Phụ thuộc vào hạ tầng cloud của AWS/Azure với chi phí tăng hàng năm' },
    { id: ff(5), value: 'Nhà cung cấp dịch vụ tư vấn bên ngoài có lựa chọn hạn chế' },
  ],
  BUYER_POWER: [
    { id: ff(6), value: 'Khách hàng SME dễ so sánh và chuyển đổi nhà cung cấp' },
    { id: ff(7), value: 'Khách hàng lớn đòi hỏi điều khoản hợp đồng có lợi cho họ' },
  ],
  THREAT_OF_SUBSTITUTES: [
    { id: ff(8), value: 'Các công cụ Excel/Google Sheet vẫn được dùng thay thế phần mềm' },
    { id: ff(9), value: 'Giải pháp quản trị tích hợp từ SAP, Oracle có tính năng BSC' },
  ],
  THREAT_OF_NEW_ENTRANTS: [
    { id: ff(10), value: 'Rào cản gia nhập thấp — nhiều startup fintech/HR-tech đang bước vào ngành' },
    { id: ff(11), value: 'Các công ty nước ngoài bắt đầu bản địa hóa sản phẩm vào Việt Nam' },
  ],
}

export const mockPestel = {
  POLITICAL: [
    { id: pe(1), value: 'Chính phủ khuyến khích doanh nghiệp áp dụng quản trị hiện đại' },
    { id: pe(2), value: 'Chương trình hỗ trợ chuyển đổi số cho SME giai đoạn 2025–2030' },
  ],
  ECONOMIC: [
    { id: pe(3), value: 'Kinh tế tăng trưởng, doanh nghiệp SME mở rộng đầu tư công nghệ' },
    { id: pe(4), value: 'Lạm phát làm tăng chi phí vận hành, ảnh hưởng ngân sách phần mềm' },
  ],
  SOCIAL: [
    { id: pe(5), value: 'Lãnh đạo thế hệ mới cởi mở hơn với công cụ quản trị số' },
    { id: pe(6), value: 'Nhận thức về tầm quan trọng của BSC và OKR ngày càng tăng' },
  ],
  TECHNOLOGICAL: [
    { id: pe(7), value: 'Doanh nghiệp SME bắt đầu quan tâm đến chuyển đổi số mạnh mẽ' },
    { id: pe(8), value: 'AI giúp tự động hóa nhiều quy trình phân tích và báo cáo' },
    { id: pe(9), value: 'Khách hàng quen với dashboard và báo cáo realtime' },
  ],
  ENVIRONMENTAL: [
    { id: pe(10), value: 'Xu hướng ESG thúc đẩy doanh nghiệp cần KPI đo lường bền vững' },
  ],
  LEGAL: [
    { id: pe(11), value: 'Quy định về bảo mật dữ liệu doanh nghiệp ngày càng chặt chẽ' },
    { id: pe(12), value: 'Luật doanh nghiệp yêu cầu minh bạch hóa thông tin quản trị' },
  ],
}

// SWOT: IDs of items selected from 7S (S/W) and 5Forces+PESTEL (O/T)
export const mockSwotS = ['7s-9', '7s-12', '7s-7']
export const mockSwotW = ['7s-10', '7s-15', '7s-6']
export const mockSwotO = ['pe-7', 'pe-6', 'ff-3']
export const mockSwotT = ['ff-1', 'ff-2', 'ff-10']

export const mockStrategies = [
  {
    id: 'strat-1', type: 'SO', name: 'Tăng trưởng thị phần SME bằng năng lực triển khai nhanh',
    description: 'Tận dụng đội ngũ kỹ thuật mạnh và phong cách lãnh đạo trao quyền để chiếm lĩnh phân khúc SME đang chuyển đổi số',
    sItems: ['7s-9', '7s-12'], oItem: 'pe-7', wItems: [], tItem: null,
  },
  {
    id: 'strat-2', type: 'ST', name: 'Củng cố vị thế bằng giá trị đo lường được',
    description: 'Phát huy văn hóa minh bạch và đo lường kết quả để tạo sự khác biệt rõ ràng so với đối thủ cạnh tranh giá thấp',
    sItems: ['7s-7'], oItem: null, wItems: [], tItem: 'ff-2',
  },
  {
    id: 'strat-3', type: 'WO', name: 'Nâng cao năng lực tư vấn chiến lược cho đội sales',
    description: 'Đào tạo đội sales về BSC và OKR để đáp ứng nhu cầu của lãnh đạo SME thế hệ mới đang quan tâm đến quản trị số',
    sItems: [], oItem: 'pe-6', wItems: ['7s-10'], tItem: null,
  },
  {
    id: 'strat-4', type: 'WT', name: 'Giữ chân nhân sự để chống chịu áp lực từ đối thủ mới',
    description: 'Xây dựng lộ trình phát triển và gói đãi ngộ hấp dẫn để giữ nhân tài, giảm rủi ro khi thị trường có thêm đối thủ gia nhập',
    sItems: [], oItem: null, wItems: ['7s-15'], tItem: 'ff-10',
  },
]
