export const mockStrategicLinks = [
  // Learning → Internal Process
  { id: 'sl-l1-i1', sourceId: 'so-l1', targetId: 'so-i1', label: 'Nâng cao kỹ năng' },
  { id: 'sl-l1-i2', sourceId: 'so-l1', targetId: 'so-i2', label: 'Cải thiện chất lượng' },
  { id: 'sl-l3-i3', sourceId: 'so-l3', targetId: 'so-i3', label: 'Nhân tài thúc đẩy số hóa' },

  // Internal Process → Customer
  { id: 'sl-i1-c1', sourceId: 'so-i1', targetId: 'so-c1', label: 'Giao hàng nhanh hơn' },
  { id: 'sl-i2-c1', sourceId: 'so-i2', targetId: 'so-c1', label: 'Sản phẩm tốt hơn' },
  { id: 'sl-i3-c3', sourceId: 'so-i3', targetId: 'so-c3', label: 'Dịch vụ tốt hơn' },

  // Customer → Financial
  { id: 'sl-c1-f1', sourceId: 'so-c1', targetId: 'so-f1', label: 'Mua lại & giới thiệu' },
  { id: 'sl-c2-f1', sourceId: 'so-c2', targetId: 'so-f1', label: 'Tăng doanh số' },
  { id: 'sl-c3-f2', sourceId: 'so-c3', targetId: 'so-f2', label: 'Giảm chi phí thu hút' },
  { id: 'sl-i3-f3', sourceId: 'so-i3', targetId: 'so-f3', label: 'Tiết kiệm chi phí vận hành' },
]
