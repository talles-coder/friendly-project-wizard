// Arquivo para reexportar os serviços Supabase quando USE_MOCK = false
import { supabaseUsersService } from '../supabase/usersService';
import { supabaseAffiliatesService } from '../supabase/affiliatesService';  
import { supabaseCouponsService } from '../supabase/couponsService';

export const usersService = supabaseUsersService;
export const affiliatesService = supabaseAffiliatesService;
export const couponsService = supabaseCouponsService;

// Dashboard service será implementado posteriormente
export const dashboardService = {
  getDashboardData: () => Promise.resolve({ data: null, success: true }),
  getRevenue: () => Promise.resolve({ data: null, success: true }),
  getRecentActivity: () => Promise.resolve({ data: [], success: true })
};