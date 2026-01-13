import axios from 'axios';

const baseUrl = import.meta.env.VITE_URL_BACKEND;
const api = axios.create({
  baseURL: `${baseUrl}/api`, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;