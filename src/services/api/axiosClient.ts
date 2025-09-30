import axios from 'axios';
import { ApiResponse } from './config';

const API_BASE_URL = 'http://localhost:3001';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para transformar respostas no formato ApiResponse
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
    // Tratar erros
    const message = error.response?.data?.message || error.message || 'Erro ao realizar operação';
    throw new Error(message);
  }
);

export default axiosClient;
