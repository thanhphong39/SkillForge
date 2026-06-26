import api from './api.js';

const employeeService = {
  // CreateEmployeeRequest: { departmentId, fullName, email, phone, positionTitle }
  create: (companyId, data) => api.post(`/companies/${companyId}/employees`, data),
  listByCompany: (companyId, departmentId) => {
    const params = departmentId ? { departmentId } : {};
    return api.get(`/companies/${companyId}/employees`, { params });
  },
  // UpdateEmployeeRequest: { departmentId, fullName, email, phone, positionTitle }
  update: (employeeId, data) => api.put(`/employees/${employeeId}`, data),
  remove: (employeeId) => api.delete(`/employees/${employeeId}`),
};

export default employeeService;
