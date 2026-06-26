import client from './client';

export const authAPI = {
  login: (email, password) =>
    client.post('/auth/login', { email, password }),

  register: (data) =>
    client.post('/auth/register', data),

  me: () =>
    client.get('/auth/me'),
};
