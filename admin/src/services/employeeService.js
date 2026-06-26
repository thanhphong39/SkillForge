import api from './api.js';

const employeeService = {
  // CreateEmployeeRequest: { departmentId, fullName, email, phone, positionTitle }
  create: (companyId, data) => api.post(`/companies/${companyId}/employees`, data),
  listByCompany: (companyId, departmentId) => {
    const params = departmentId ? { departmentId } : {};
    return api.get(`/companies/${companyId}/employees`, { params });
  },
};

export default employeeService;
