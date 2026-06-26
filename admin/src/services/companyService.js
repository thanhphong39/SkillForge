import api from './api.js';

const companyService = {
  getById: (id) => api.get(`/companies/${id}`),
  // UpdateCompanyRequest: { name, taxCode, industry, size }
  update: (id, data) => api.put(`/companies/${id}`, data),
};

export default companyService;
