// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL:  'http://localhost:5000/api',
});

// Add token header if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const createResource = async (data: any) => {
  const response = await api.post('/resources', data);
  return response.data;
};

export const getResources = async () => {
  const response = await api.get('/resources');
  return response.data;
};

export const updateResource = async (id: string, data: any) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};
export interface DeleteResponse {
  message: string;
}

export const deleteResource = async (id: string):Promise<DeleteResponse> => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};

export default api;
