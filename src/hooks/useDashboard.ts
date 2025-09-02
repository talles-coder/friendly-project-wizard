import { DashboardData } from '@/types';
import { dashboardService } from '@/services/api';
import { useApi } from './useApi';

// Hook para dados do dashboard
export function useDashboard() {
  return useApi(() => dashboardService.getDashboardData());
}

// Hook para dados de receita
export function useRevenue(period: 'week' | 'month' | 'year' = 'month') {
  return useApi(() => dashboardService.getRevenue(period), [period]);
}

// Hook para atividade recente
export function useRecentActivity() {
  return useApi(() => dashboardService.getRecentActivity());
}