# Hướng dẫn Test API trên Swagger

> Swagger UI: **http://localhost:8080/api/v1/swagger-ui/index.html**  
> Base URL: `http://localhost:8080/api/v1`  
> Tất cả response đều có dạng: `{ "success": true, "data": <T>, "message": null }`

---

## LƯU Ý QUAN TRỌNG

- Test **theo thứ tự từ trên xuống** — mỗi bước cần UUID từ bước trước
- Sau mỗi bước, copy `data.id` (hoặc trường UUID cần) lưu lại để dùng ở bước tiếp theo
- Không có Auth — tất cả API đều không cần Bearer token

---

## BƯỚC 0: KHỞI TẠO (Setup)

### 0.1 — Tạo Công ty
```
POST /companies
```
**Body:**
```json
{
  "name": "Công ty CP Thiên Phú",
  "industry": "Technology",
  "size": "MEDIUM",
  "taxCode": "0123456789"
}
```
**Lưu lại:** `data.id` → gọi là `{companyId}`

---

### 0.2 — Tạo BSC Strategy
```
POST /companies/{companyId}/bsc-strategies
```
**Body:**
```json
{
  "name": "Chiến lược BSC 2024",
  "description": "Kế hoạch BSC năm 2024",
  "year": 2024
}
```
**Lưu lại:** `data.id` → gọi là `{strategyId}`

---

### 0.3 — Kiểm tra trạng thái các bước
```
GET /bsc-strategies/{strategyId}/steps
```
**Kết quả mong đợi:** danh sách các bước B1–B8 với `status: "PENDING"`

---

### 0.4 — Tạo Phòng ban (cho B5 Fishbone)
```
POST /companies/{companyId}/departments
```
**Body (tạo lần 1):**
```json
{
  "name": "Phòng Kinh doanh",
  "code": "KD",
  "color": "#3b82f6",
  "description": "Phòng kinh doanh"
}
```
**Lưu lại:** `data.id` → `{departmentId_1}`

**Body (tạo lần 2):**
```json
{
  "name": "Phòng Kỹ thuật",
  "code": "KT",
  "color": "#10b981"
}
```
**Lưu lại:** `data.id` → `{departmentId_2}`

---

## B1 — ASSESSMENT (Đánh giá hiện trạng)

### B1.1 — Lưu dữ liệu tài chính
```
PUT /bsc-strategies/{strategyId}/assessment/financials
```
**Body:**
```json
{
  "items": [
    { "year": 2022, "revenue": 10000000000, "profit": 1500000000 },
    { "year": 2023, "revenue": 12000000000, "profit": 2000000000 }
  ]
}
```

---

### B1.2 — Lưu thị phần
```
PUT /bsc-strategies/{strategyId}/assessment/market-shares
```
**Body:**
```json
{
  "items": [
    { "periodType": "CURRENT", "companyName": "Công ty mình", "marketSharePercent": 35, "ownCompany": true, "displayOrder": 0 },
    { "periodType": "CURRENT", "companyName": "Đối thủ A", "marketSharePercent": 40, "ownCompany": false, "displayOrder": 1 },
    { "periodType": "CURRENT", "companyName": "Đối thủ B", "marketSharePercent": 25, "ownCompany": false, "displayOrder": 2 },
    { "periodType": "FUTURE",  "companyName": "Công ty mình", "marketSharePercent": 45, "ownCompany": true, "displayOrder": 0 },
    { "periodType": "FUTURE",  "companyName": "Đối thủ A", "marketSharePercent": 35, "ownCompany": false, "displayOrder": 1 },
    { "periodType": "FUTURE",  "companyName": "Đối thủ B", "marketSharePercent": 20, "ownCompany": false, "displayOrder": 2 }
  ]
}
```
> Tổng `marketSharePercent` mỗi nhóm `CURRENT` và `FUTURE` phải = **100**

---

### B1.3 — Lưu thông tin văn bản
```
PUT /bsc-strategies/{strategyId}/assessment/text-items
```
**Body:**
```json
{
  "items": [
    { "category": "CURRENT_SEGMENT",         "content": "Doanh nghiệp vừa và nhỏ", "displayOrder": 0 },
    { "category": "FUTURE_SEGMENT",           "content": "Doanh nghiệp lớn",        "displayOrder": 0 },
    { "category": "CURRENT_CORE_PRODUCT",     "content": "Phần mềm kế toán",         "displayOrder": 0 },
    { "category": "FUTURE_CORE_PRODUCT",      "content": "Phần mềm ERP",             "displayOrder": 0 },
    { "category": "COMPANY_STRENGTH",         "content": "Đội ngũ kỹ thuật mạnh",    "displayOrder": 0 },
    { "category": "INDUSTRY_SUCCESS_FACTOR",  "content": "Chăm sóc khách hàng tốt",  "displayOrder": 0 },
    { "category": "COMPETITOR_STRENGTH",      "content": "Nguồn vốn lớn",            "displayOrder": 0 },
    { "category": "COMPETITOR_WEAKNESS",      "content": "Dịch vụ sau bán kém",      "displayOrder": 0 },
    { "category": "COMPETITIVE_ADVANTAGE",    "content": "Giá cạnh tranh",           "displayOrder": 0 }
  ]
}
```

**Các giá trị `category` hợp lệ:**
| category | Ý nghĩa |
|---|---|
| `CURRENT_SEGMENT` | Phân khúc khách hàng hiện tại |
| `FUTURE_SEGMENT` | Phân khúc khách hàng tương lai |
| `CURRENT_CORE_PRODUCT` | Sản phẩm chủ lực hiện tại |
| `FUTURE_CORE_PRODUCT` | Sản phẩm chủ lực tương lai |
| `COMPANY_STRENGTH` | Điểm mạnh công ty |
| `INDUSTRY_SUCCESS_FACTOR` | Yếu tố thành công ngành |
| `COMPETITOR_STRENGTH` | Điểm mạnh đối thủ |
| `COMPETITOR_WEAKNESS` | Điểm yếu đối thủ |
| `COMPETITIVE_ADVANTAGE` | Lợi thế cạnh tranh |

---

### B1.4 — Đọc lại Assessment
```
GET /bsc-strategies/{strategyId}/assessment
```

---

### B1.5 — Hoàn thành B1 ✅
```
POST /bsc-strategies/{strategyId}/assessment/complete
```
**Kết quả mong đợi:** `success: true`

---

## B2 — STRATEGY BUILDING (Xây dựng chiến lược)

### B2.1 — Lưu Analysis Items (SO/WO/ST/WT)
```
PUT /bsc-strategies/{strategyId}/analysis-items
```
**Body:**
```json
{
  "items": [
    { "modelType": "SWOT", "factorCode": "S", "content": "Đội ngũ kỹ thuật mạnh",       "displayOrder": 0 },
    { "modelType": "SWOT", "factorCode": "S", "content": "Sản phẩm chất lượng cao",      "displayOrder": 1 },
    { "modelType": "SWOT", "factorCode": "W", "content": "Nguồn vốn hạn chế",            "displayOrder": 0 },
    { "modelType": "SWOT", "factorCode": "W", "content": "Thương hiệu chưa nổi",         "displayOrder": 1 },
    { "modelType": "SWOT", "factorCode": "O", "content": "Thị trường mở rộng",           "displayOrder": 0 },
    { "modelType": "SWOT", "factorCode": "O", "content": "Chính sách hỗ trợ doanh nghiệp","displayOrder": 1 },
    { "modelType": "SWOT", "factorCode": "T", "content": "Đối thủ cạnh tranh mạnh",      "displayOrder": 0 },
    { "modelType": "SWOT", "factorCode": "T", "content": "Kinh tế bất ổn",               "displayOrder": 1 }
  ]
}
```

**`factorCode` hợp lệ:** `S` | `W` | `O` | `T`

**Lưu lại:** trong `data` (mảng analysisItems), copy `id` của từng item:
- S items → `{analysisItemId_S1}`, `{analysisItemId_S2}`
- W items → `{analysisItemId_W1}`, `{analysisItemId_W2}`
- O items → `{analysisItemId_O1}`, `{analysisItemId_O2}`
- T items → `{analysisItemId_T1}`, `{analysisItemId_T2}`

---

### B2.2 — Tạo SWOT Items (gắn analysis item vào ô SWOT)
```
POST /bsc-strategies/{strategyId}/swot-items
```
**Body (tạo 1 SWOT item — lặp lại cho mỗi item):**
```json
{
  "swotType": "S",
  "sourceAnalysisItemId": "{analysisItemId_S1}"
}
```

**`swotType` hợp lệ:** `S` | `W` | `O` | `T`

> Response trả về toàn bộ `StrategyBuildingResponse` gồm `swotItems[]`. Từ `swotItems`, lấy `id` (swotItemId) tương ứng.

**Tạo tối thiểu:**
- 1 SWOT S item → lưu `{swotItemId_S1}`
- 1 SWOT W item → lưu `{swotItemId_W1}`
- 1 SWOT O item → lưu `{swotItemId_O1}`
- 1 SWOT T item → lưu `{swotItemId_T1}`

---

### B2.3 — Tạo Candidate Strategies (chiến lược ứng viên)
```
POST /bsc-strategies/{strategyId}/candidate-strategies
```
**Body (SO strategy):**
```json
{
  "strategyGroup": "SO",
  "name": "Chiến lược tận dụng S+O",
  "description": "Dùng điểm mạnh để khai thác cơ hội",
  "swotItemIds": ["{swotItemId_S1}", "{swotItemId_O1}"],
  "displayOrder": 0
}
```

**Body (WO strategy):**
```json
{
  "strategyGroup": "WO",
  "name": "Chiến lược cải thiện W+O",
  "description": "Cải thiện điểm yếu qua cơ hội",
  "swotItemIds": ["{swotItemId_W1}", "{swotItemId_O1}"],
  "displayOrder": 1
}
```

**`strategyGroup` hợp lệ:** `SO` | `WO` | `ST` | `WT`

**Lưu lại:** `data.id` → `{candidateStrategyId_1}`, `{candidateStrategyId_2}`

---

### B2.4 — Hoàn thành B2 ✅
```
POST /bsc-strategies/{strategyId}/strategy-building/complete
```

---

## B3 — STRATEGY SELECTION (Chọn chiến lược)

### B3.1 — Lấy danh sách chiến lược ứng viên
```
GET /bsc-strategies/{strategyId}/candidate-strategies
```

---

### B3.2 — Chọn chiến lược (1 hoặc 2 chiến lược)
```
PUT /bsc-strategies/{strategyId}/selected-strategies
```
**Body (chọn 1 chiến lược):**
```json
{
  "items": [
    { "candidateStrategyId": "{candidateStrategyId_1}", "priorityOrder": 1 }
  ]
}
```

**Body (chọn 2 chiến lược):**
```json
{
  "items": [
    { "candidateStrategyId": "{candidateStrategyId_1}", "priorityOrder": 1 },
    { "candidateStrategyId": "{candidateStrategyId_2}", "priorityOrder": 2 }
  ]
}
```

> Tối đa 2 chiến lược. Nếu chọn 2 → B4 sẽ có bước merge bản đồ chiến lược.

**Lưu lại:** `data[0].id` → `{selectedStrategyId_1}` (từ `selected-strategies` response)

---

### B3.3 — Lấy danh sách đã chọn
```
GET /bsc-strategies/{strategyId}/selected-strategies
```

---

### B3.4 — Hoàn thành B3 ✅
```
POST /bsc-strategies/{strategyId}/strategy-result/complete
```

---

## B4 — STRATEGY MAP (Bản đồ chiến lược)

### B4.1 — Tạo Strategy Map (1 map cho mỗi selected strategy)
```
POST /bsc-strategies/{strategyId}/strategy-maps
```
**Body:**
```json
{
  "selectedStrategyId": "{selectedStrategyId_1}",
  "mapType": "INDIVIDUAL"
}
```
**Lưu lại:** `data.id` → `{strategyMapId_1}`

---

### B4.2 — Tạo Strategic Objectives (mục tiêu chiến lược)
```
POST /strategy-maps/{strategyMapId}/objectives
```
**Body (thêm 1 mục tiêu — lặp lại cho mỗi góc độ):**
```json
{
  "selectedStrategyId": "{selectedStrategyId_1}",
  "name": "Tăng trưởng doanh thu 20%",
  "description": "Đạt mức tăng trưởng doanh thu 20% YoY",
  "perspectiveCode": "FINANCIAL",
  "displayOrder": 0
}
```

**`perspectiveCode` hợp lệ:**
| Code | Góc độ BSC |
|---|---|
| `FINANCIAL` | Tài chính |
| `CUSTOMER` | Khách hàng |
| `INTERNAL_PROCESS` | Quy trình nội bộ |
| `LEARNING_AND_GROWTH` | Học hỏi & phát triển |

> **Bắt buộc:** mỗi `perspectiveCode` phải có ít nhất 1 mục tiêu (tổng cộng ≥ 4 mục tiêu)

**Tạo tối thiểu 4 mục tiêu — ví dụ:**
```json
{ "selectedStrategyId": "{selectedStrategyId_1}", "name": "Tăng doanh thu 20%",      "perspectiveCode": "FINANCIAL",          "displayOrder": 0 }
{ "selectedStrategyId": "{selectedStrategyId_1}", "name": "Nâng độ hài lòng KH 90%", "perspectiveCode": "CUSTOMER",           "displayOrder": 0 }
{ "selectedStrategyId": "{selectedStrategyId_1}", "name": "Tối ưu quy trình bán",    "perspectiveCode": "INTERNAL_PROCESS",   "displayOrder": 0 }
{ "selectedStrategyId": "{selectedStrategyId_1}", "name": "Đào tạo kỹ năng số",      "perspectiveCode": "LEARNING_AND_GROWTH","displayOrder": 0 }
```

**Lưu lại:** `data.id` → `{objectiveId_1}`, `{objectiveId_2}`, v.v.

---

### B4.3 — Tạo Objective Links (liên kết nhân quả — tuỳ chọn)
```
POST /strategy-maps/{strategyMapId}/objective-links
```
**Body:**
```json
{
  "sourceObjectiveId": "{objectiveId_3}",
  "targetObjectiveId": "{objectiveId_1}",
  "note": "Quy trình tốt → doanh thu tốt"
}
```

---

### B4.4 — (Nếu chọn 2 chiến lược) Build Final Objectives
```
POST /bsc-strategies/{strategyId}/final-objectives/build
```
**Body:**
```json
{
  "items": [
    {
      "name": "Tăng doanh thu tổng hợp",
      "description": "Kết hợp từ 2 chiến lược",
      "perspectiveCode": "FINANCIAL",
      "sourceType": "MERGED",
      "sourceObjectiveIds": ["{objectiveId_S1_financial}", "{objectiveId_S2_financial}"],
      "displayOrder": 0
    }
  ]
}
```
**`sourceType` hợp lệ:** `ORIGINAL` | `MERGED` | `MANUAL_EDITED`

---

### B4.5 — Xem bản đồ chiến lược cuối
```
GET /bsc-strategies/{strategyId}/final-strategy-map
```

---

### B4.6 — Hoàn thành B4 ✅
```
POST /bsc-strategies/{strategyId}/strategy-map/complete
```

---

## B5 — FISHBONE (Phân tích nguyên nhân KPI)

> Cần có `{departmentId}` từ Bước 0.4 và `{finalObjectiveId}` từ B4

### B5.1 — Lấy danh sách phòng ban
```
GET /companies/{companyId}/departments
```

---

### B5.2 — Gán phòng ban tham gia mục tiêu
```
POST /bsc-strategies/{strategyId}/department-participations
```
**Body:**
```json
{
  "finalStrategicObjectiveId": "{finalObjectiveId}",
  "departmentId": "{departmentId_1}"
}
```
**Lưu lại:** `data.id` → `{participationId}`

---

### B5.3 — Tạo KPI cho phòng ban
```
POST /department-kpis
```
**Body:**
```json
{
  "bscStrategyId": "{strategyId}",
  "finalStrategicObjectiveId": "{finalObjectiveId}",
  "departmentId": "{departmentId_1}",
  "departmentParticipationId": "{participationId}",
  "name": "Tỷ lệ chốt đơn hàng",
  "description": "Số đơn hàng chốt / Số leads",
  "displayOrder": 0
}
```
**Lưu lại:** `data.id` → `{kpiId}`

---

### B5.4 — Xem Fishbone toàn công ty
```
GET /bsc-strategies/{strategyId}/fishbone/company
```

---

### B5.5 — Xem Fishbone theo phòng ban
```
GET /bsc-strategies/{strategyId}/fishbone/departments/{departmentId}
```

---

### B5.6 — Hoàn thành B5 ✅
```
POST /bsc-strategies/{strategyId}/fishbone/complete
```

---

## ADMIN — Quản lý công ty & nhân sự

### A1 — Cập nhật thông tin công ty
```
PUT /companies/{companyId}
```
**Body:**
```json
{
  "name": "Công ty CP Thiên Phú",
  "taxCode": "0123456789",
  "industry": "Technology",
  "size": "MEDIUM"
}
```

---

### A2 — Tạo nhân viên
```
POST /companies/{companyId}/employees
```
**Body:**
```json
{
  "departmentId": "{departmentId_1}",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@company.vn",
  "phone": "0901234567",
  "positionTitle": "Trưởng phòng Kinh doanh"
}
```

---

### A3 — Danh sách nhân viên
```
GET /companies/{companyId}/employees
```

**Lọc theo phòng ban (query param):**
```
GET /companies/{companyId}/employees?departmentId={departmentId_1}
```

---

### A4 — Cập nhật phòng ban
```
PUT /departments/{departmentId}
```
**Body:**
```json
{
  "name": "Phòng Kinh doanh",
  "code": "KD",
  "color": "#3b82f6",
  "description": "Phòng kinh doanh và marketing"
}
```

---

## TRÌNH TỰ TEST ĐẦY ĐỦ (Quick checklist)

```
□ 0.1  POST /companies                                    → lấy companyId
□ 0.2  POST /companies/{id}/bsc-strategies                → lấy strategyId
□ 0.3  GET  /bsc-strategies/{id}/steps                   → kiểm tra workflow
□ 0.4  POST /companies/{id}/departments (x2)              → lấy departmentId x2

□ B1.1 PUT  /bsc-strategies/{id}/assessment/financials
□ B1.2 PUT  /bsc-strategies/{id}/assessment/market-shares
□ B1.3 PUT  /bsc-strategies/{id}/assessment/text-items
□ B1.4 GET  /bsc-strategies/{id}/assessment              → verify
□ B1.5 POST /bsc-strategies/{id}/assessment/complete     ✅

□ B2.1 PUT  /bsc-strategies/{id}/analysis-items          → lấy analysisItemId x8
□ B2.2 POST /bsc-strategies/{id}/swot-items (x4)         → lấy swotItemId x4
□ B2.3 POST /bsc-strategies/{id}/candidate-strategies (x2)→ lấy candidateStrategyId x2
□ B2.4 POST /bsc-strategies/{id}/strategy-building/complete ✅

□ B3.1 GET  /bsc-strategies/{id}/candidate-strategies
□ B3.2 PUT  /bsc-strategies/{id}/selected-strategies     → lấy selectedStrategyId
□ B3.3 GET  /bsc-strategies/{id}/selected-strategies     → verify
□ B3.4 POST /bsc-strategies/{id}/strategy-result/complete ✅

□ B4.1 POST /bsc-strategies/{id}/strategy-maps           → lấy strategyMapId
□ B4.2 POST /strategy-maps/{id}/objectives (x4 góc độ)  → lấy objectiveId x4
□ B4.3 POST /strategy-maps/{id}/objective-links          (tuỳ chọn)
□ B4.4 GET  /bsc-strategies/{id}/final-strategy-map     → verify
□ B4.5 POST /bsc-strategies/{id}/strategy-map/complete  ✅

□ B5.1 GET  /companies/{id}/departments
□ B5.2 POST /bsc-strategies/{id}/department-participations → lấy participationId
□ B5.3 POST /department-kpis                             → lấy kpiId
□ B5.4 GET  /bsc-strategies/{id}/fishbone/company       → verify
□ B5.5 POST /bsc-strategies/{id}/fishbone/complete      ✅
```

---

## RESPONSE FORMAT

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": null
}
```

**Error:**
```json
{
  "success": false,
  "data": null,
  "message": "Mô tả lỗi"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed: field must not be blank"
}
```

---

## ENUM REFERENCE

| Enum | Giá trị hợp lệ |
|---|---|
| `factorCode` (SWOT) | `S` \| `W` \| `O` \| `T` |
| `swotType` | `S` \| `W` \| `O` \| `T` |
| `strategyGroup` | `SO` \| `WO` \| `ST` \| `WT` |
| `perspectiveCode` | `FINANCIAL` \| `CUSTOMER` \| `INTERNAL_PROCESS` \| `LEARNING_AND_GROWTH` |
| `mapType` | `INDIVIDUAL` \| `FINAL` |
| `periodType` | `CURRENT` \| `FUTURE` |
| `sourceType` | `ORIGINAL` \| `MERGED` \| `MANUAL_EDITED` |
| `size` (Company) | `SMALL` \| `MEDIUM` \| `LARGE` |

---

## LỖI THƯỜNG GẶP

| Lỗi | Nguyên nhân | Cách fix |
|---|---|---|
| `400 Validation failed` | Thiếu field `@NotBlank` / `@NotNull` | Kiểm tra body đủ field bắt buộc |
| `404 Not found` | UUID sai hoặc không tồn tại | Copy UUID đúng từ response trước |
| Tổng thị phần ≠ 100% | `marketSharePercent` cộng lại ≠ 100 | Điều chỉnh lại phần trăm |
| Thiếu góc độ BSC | `perspectiveCode` chưa đủ 4 loại | Thêm objective cho đủ 4 góc độ |
| `swotItemIds` rỗng | Chưa tạo SWOT items trước | Chạy B2.2 trước B2.3 |
