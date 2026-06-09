import client from './client';

export const suppliersAPI = {
  getAll: (params) =>
    client.get('/suppliers', { params }),

  getById: (id) =>
    client.get(`/suppliers/${id}`),

  create: (data) =>
    client.post('/suppliers', data),

  update: (id, data) =>
    client.put(`/suppliers/${id}`, data),

  delete: (id) =>
    client.delete(`/suppliers/${id}`),
};
