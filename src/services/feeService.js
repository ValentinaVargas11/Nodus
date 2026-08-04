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

export const crear = async (data) => {
  const { data: response } = await api.post('/fees', data);
  return response.data;
};

export const generar = async (month) => {
  const { data: response } = await api.post('/fees/generar', { month });
  return response.data;
};

export const actualizar = async (id, data) => {
  const { data: response } = await api.put(`/fees/${id}`, data);
  return response.data;
};

export const actualizarDetalles = async (id, data) => {
  const { data: response } = await api.put(`/fees/${id}/detalles`, data);
  return response.data;
};

export const eliminar = async (id) => {
  const { data } = await api.delete(`/fees/${id}`);
  return data;
};
