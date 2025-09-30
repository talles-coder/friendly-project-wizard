import axios from 'axios';
import { ApiResponse } from './config';

const API_BASE_URL = 'http://localhost:3001';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token automaticamente
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para transformar respostas e tratar erros
axiosClient.interceptors.response.use(
  (response) => {
    // Transformar resposta no formato esperado
    const apiResponse: ApiResponse<any> = {
      data: response.data,
      success: true,
      message: 'Operação realizada com sucesso'
    };
    return { ...response, data: apiResponse };
  },
  (error) => {
    // Tratar erro 401 (token expirado)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    
    // Tratar outros erros
    const message = error.response?.data?.message || error.message || 'Erro ao realizar operação';
    throw new Error(message);
  }
);

export default axiosClient;
