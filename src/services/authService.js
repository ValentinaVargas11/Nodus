import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data.data;
};

export const refresh = async (refreshToken) => {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data.data;
};

export const logout = async (refreshToken) => {
  await api.post('/auth/logout', { refreshToken });
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data;
};
