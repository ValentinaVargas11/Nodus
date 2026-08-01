import api from './api';

export const listar = async () => {
  const { data } = await api.get('/inventory');
  return data;
};

export const obtener = async (id) => {
  const { data } = await api.get(`/inventory/${id}`);
  return data.data;
};

export const crear = async (datos) => {
  const { data } = await api.post('/inventory', datos);
  return data.data;
};

export const actualizar = async (id, datos) => {
  const { data } = await api.patch(`/inventory/${id}`, datos);
  return data.data;
};

export const ajustarStock = async (id, change) => {
  const { data } = await api.patch(`/inventory/${id}/quantity`, { change });
  return data.data;
};

export const obtenerAlertas = async () => {
  const { data } = await api.get('/inventory/alerts');
  return data.data;
};
