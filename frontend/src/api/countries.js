import client from './client';

export const countriesAPI = {
  getAll: () => client.get('/countries'),
  getById: (id) => client.get(`/countries/${id}`),
  create: (data) => client.post('/countries', data),
  update: (id, data) => client.put(`/countries/${id}`, data),
  delete: (id) => client.delete(`/countries/${id}`),
};
