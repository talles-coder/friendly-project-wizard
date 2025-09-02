// Exportação centralizada de todos os serviços de API
export { usersService } from './usersService';
export { couponsService } from './couponsService';
export { affiliatesService } from './affiliatesService';
export { dashboardService } from './dashboardService';
export { API_CONFIG, apiClient } from './config';
export type { ApiResponse, PaginatedResponse, ApiError } from './config';

// Re-exportar dados mock para uso direto quando necessário
export { MOCK_USERS, MOCK_COUPONS, MOCK_AFFILIATES, MOCK_DASHBOARD, MOCK_OPTIONS } from './mockData';