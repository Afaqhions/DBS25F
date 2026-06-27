import client from './client';

export const authAPI = {
  login: (email, password) =>
    client.post('/auth/login', { email, password }),

  me: () =>
    client.get('/auth/me'),
};
