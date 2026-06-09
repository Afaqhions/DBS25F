import client from './client';

export const ordersAPI = {
  getAll: (params) =>
    client.get('/orders', { params }),

  getById: (id) =>
    client.get(`/orders/${id}`),

  create: (data) =>
    client.post('/orders', data),

  updateStatus: (id, status) =>
    client.put(`/orders/${id}/status`, { status }),

  cancel: (id) =>
    client.delete(`/orders/${id}`),
};
