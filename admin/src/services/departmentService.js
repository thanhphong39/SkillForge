import api from './api.js';

const departmentService = {
  // CreateDepartmentRequest: { name, code, color, description }
  create: (companyId, data) => api.post(`/companies/${companyId}/departments`, data),
  listByCompany: (companyId) => api.get(`/companies/${companyId}/departments`),
  // UpdateDepartmentRequest: { name, code, color, description }
  update: (departmentId, data) => api.put(`/departments/${departmentId}`, data),
  remove: (departmentId) => api.delete(`/departments/${departmentId}`),
};

export default departmentService;
