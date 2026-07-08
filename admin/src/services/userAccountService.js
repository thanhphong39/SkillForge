import api from './api.js';

const userAccountService = {
  /**
   * POST /employees/{employeeId}/account
   * CreateUserAccountRequest: { email, password, role }
   * role: CEO | DEPARTMENT_HEAD | EMPLOYEE | COMPANY_ADMIN | SYSTEM_ADMIN
   */
  create: (employeeId, data) => api.post(`/employees/${employeeId}/account`, data),
};

export default userAccountService;
