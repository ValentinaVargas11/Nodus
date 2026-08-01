import api from './api';

export const listar = async (params = {}) => {
  const { data } = await api.get('/rooms', { params });
  return data;
};

export const obtener = async (id) => {
  const { data } = await api.get(`/rooms/${id}`);
  return data.data;
};

export const cambiarEstado = async (id, status) => {
  const { data } = await api.patch(`/rooms/${id}/status`, { status });
  return data.data;
};

export const asignarInquilino = async (id, datos) => {
  const { data } = await api.patch(`/rooms/${id}/assign`, datos);
  return data.data;
};

export const obtenerStats = async () => {
  const { data } = await api.get('/rooms/stats');
  return data.data;
};
