import client from './client';

export const merchantsAPI = {
  getAll: (params) => client.get('/merchants', { params }),
  getById: (id) => client.get(`/merchants/${id}`),
  create: (data) => client.post('/merchants', data),
  update: (id, data) => client.put(`/merchants/${id}`, data),
  delete: (id) => client.delete(`/merchants/${id}`),
};
