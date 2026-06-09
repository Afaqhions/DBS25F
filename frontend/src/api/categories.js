import client from './client';

export const categoriesAPI = {
  getAll: () =>
    client.get('/categories'),

  getById: (id) =>
    client.get(`/categories/${id}`),

  create: (data) =>
    client.post('/categories', data),

  update: (id, data) =>
    client.put(`/categories/${id}`, data),

  delete: (id) =>
    client.delete(`/categories/${id}`),
};
