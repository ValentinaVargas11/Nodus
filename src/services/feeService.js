import api from './api';

export const listar = async (params = {}) => {
  const { data } = await api.get('/fees', { params });
  return data;
};

export const obtener = async (id) => {
  const { data } = await api.get(`/fees/${id}`);
  return data.data;
};

export const cambiarEstado = async (id, status) => {
  const { data } = await api.patch(`/fees/${id}/status`, { status });
  return data.data;
};

export const obtenerResumen = async () => {
  const { data } = await api.get('/fees/summary');
  return data.data;
};
