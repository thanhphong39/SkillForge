import api from './api.js';

const companyService = {
  // CreateCompanyRequest: { name, taxCode, industry, size }
  create: (data) => api.post('/companies', data),
  getById: (id) => api.get(`/companies/${id}`),
  // UpdateCompanyRequest: { name, taxCode, industry, size }
  update: (id, data) => api.put(`/companies/${id}`, data),
};

export default companyService;
