import api from './api';

export const listar = async (params = {}) => {
  const { data } = await api.get('/tasks', { params });
  return data;
};

export const obtener = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data;
};

export const crear = async (datos) => {
  const { data } = await api.post('/tasks', datos);
  return data.data;
};

export const actualizar = async (id, cambios) => {
  const { data } = await api.patch(`/tasks/${id}`, cambios);
  return data.data;
};
