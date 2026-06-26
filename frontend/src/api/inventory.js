import client from './client';

export const inventoryAPI = {
  getAll: (params) =>
    client.get('/inventory', { params }),

  getById: (id) =>
    client.get(`/inventory/${id}`),

  create: (data) =>
    client.post('/inventory', data),
};
