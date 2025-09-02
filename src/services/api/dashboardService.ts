import { DashboardData } from "@/types";
import { API_CONFIG, ApiResponse, apiClient, simulateNetworkDelay } from "./config";
import { MOCK_DASHBOARD } from "./mockData";

class DashboardService {
  // GET /dashboard - Dados do dashboard
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      // Simular dados dinâmicos
      const dynamicData: DashboardData = {
        ...MOCK_DASHBOARD,
        membershipRevenue: MOCK_DASHBOARD.membershipRevenue + (Math.random() - 0.5) * 10000,
        totalUsedCoupons: MOCK_DASHBOARD.totalUsedCoupons + Math.floor(Math.random() * 50),
        couponUsageRate: Math.min(100, MOCK_DASHBOARD.couponUsageRate + (Math.random() - 0.5) * 20)
      };

      return {
        data: dynamicData,
        success: true,
        message: "Dados do dashboard carregados com sucesso"
      };
    }

    return apiClient.get<DashboardData>('/dashboard');
  }

  // GET /dashboard/revenue?period=month - Receita por período
  async getRevenue(period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    current: number;
    previous: number;
    growth: number;
    data: Array<{ date: string; value: number }>;
  }>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const baseValue = 50000;
      const current = baseValue + Math.random() * 30000;
      const previous = baseValue + Math.random() * 25000;
      const growth = ((current - previous) / previous) * 100;

      // Gerar dados fictícios para o gráfico
      const generateData = () => {
        const data = [];
        const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
        
        for (let i = days; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split('T')[0],
            value: Math.random() * 5000 + 1000
          });
        }
        return data;
      };

      return {
        data: {
          current,
          previous,
          growth,
          data: generateData()
        },
        success: true,
        message: "Dados de receita carregados com sucesso"
      };
    }

    return apiClient.get<{
      current: number;
      previous: number;
      growth: number;
      data: Array<{ date: string; value: number }>;
    }>(`/dashboard/revenue?period=${period}`);
  }

  // GET /dashboard/activity - Atividade recente
  async getRecentActivity(): Promise<ApiResponse<Array<{
    id: string;
    type: 'coupon_used' | 'affiliate_joined' | 'user_registered';
    description: string;
    timestamp: string;
    user?: string;
  }>>> {
    if (API_CONFIG.USE_MOCK) {
      await simulateNetworkDelay();
      
      const activities = [
        {
          id: '1',
          type: 'coupon_used' as const,
          description: 'Cupom WELCOME2024 foi utilizado',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: 'João Silva'
        },
        {
          id: '2',
          type: 'affiliate_joined' as const,
          description: 'Novo afiliado cadastrado: Maria Oliveira',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'coupon_used' as const,
          description: 'Cupom BLACKFRIDAY2024 foi utilizado',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user: 'Ana Costa'
        },
        {
          id: '4',
          type: 'user_registered' as const,
          description: 'Novo usuário registrado no sistema',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          user: 'Pedro Santos'
        }
      ];

      return {
        data: activities,
        success: true,
        message: "Atividades carregadas com sucesso"
      };
    }

    return apiClient.get<Array<{
      id: string;
      type: 'coupon_used' | 'affiliate_joined' | 'user_registered';
      description: string;
      timestamp: string;
      user?: string;
    }>>('/dashboard/activity');
  }
}

export const dashboardService = new DashboardService();