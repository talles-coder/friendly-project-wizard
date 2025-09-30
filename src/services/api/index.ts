// Exportação centralizada de todos os serviços de API
import { API_CONFIG } from './config';

// Importar serviços baseado na configuração
const servicesModule = import('./mockServices');

// Reexportar serviços dinamicamente
export const usersService = (await servicesModule).usersService;
export const couponsService = (await servicesModule).couponsService;
export const affiliatesService = (await servicesModule).affiliatesService;
export const dashboardService = (await servicesModule).dashboardService;

export { API_CONFIG, apiClient } from './config';
export type { ApiResponse, PaginatedResponse, ApiError } from './config';

// Re-exportar dados mock para uso direto quando necessário
export { MOCK_USERS, MOCK_COUPONS, MOCK_AFFILIATES, MOCK_DASHBOARD, MOCK_OPTIONS } from './mockData';

// Exportar novos serviços
export { childCouponsService } from './childCouponsService';
export { availabilityRulesService } from './availabilityRulesService';
export type { ChildCoupon } from './childCouponsService';
export type { AvailabilityRule } from './availabilityRulesService';