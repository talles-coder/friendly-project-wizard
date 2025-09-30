// Exportação centralizada de todos os serviços de API
export { usersService } from './usersService';
export { couponsService } from './couponsService';
export { affiliatesService } from './affiliatesService';
export { dashboardService } from './dashboardService';

export { API_CONFIG, apiClient } from './config';
export type { ApiResponse, PaginatedResponse, ApiError } from './config';

// Exportar novos serviços
export { childCouponsService } from './childCouponsService';
export { availabilityRulesService } from './availabilityRulesService';
export type { ChildCoupon } from './childCouponsService';
export type { AvailabilityRule } from './availabilityRulesService';