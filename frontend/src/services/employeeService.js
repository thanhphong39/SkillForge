import api from './api';

const employeeService = {
  create: (companyId, data) =>
    api.post(`/companies/${companyId}/employees`, data),
  // data: { departmentId, fullName, email, phone?, positionTitle? }

  listByCompany: (companyId, departmentId = null) => {
    const params = departmentId ? { departmentId } : {};
    return api.get(`/companies/${companyId}/employees`, { params });
  },
};

export default employeeService;
