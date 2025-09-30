// Configuração da API
export const API_CONFIG = {
  // Mudar para true quando quiser usar o backend real
  USE_MOCK: false,
  
  // URL base do seu backend
  BASE_URL: 'http://localhost:3001',
    
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Utilitário para simular delay de rede no mock
export const simulateNetworkDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Cliente HTTP básico
export class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.headers = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  setAuthToken(token: string) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.headers.Authorization;
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();