import { DashboardData } from "@/types";
import { ApiResponse } from "./config";
import axiosClient from "./axiosClient";

class DashboardService {
  // GET /dashboard - Dados do dashboard
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    const response = await axiosClient.get<ApiResponse<DashboardData>>('/dashboard');
    return response.data;
  }

  // GET /dashboard/revenue?period=month - Receita por período
  async getRevenue(period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    current: number;
    previous: number;
    growth: number;
    data: Array<{ date: string; value: number }>;
  }>> {
    const response = await axiosClient.get<ApiResponse<{
      current: number;
      previous: number;
      growth: number;
      data: Array<{ date: string; value: number }>;
    }>>(`/dashboard/revenue?period=${period}`);
    return response.data;
  }

  // GET /dashboard/activity - Atividade recente
  async getRecentActivity(): Promise<ApiResponse<Array<{
    id: string;
    type: 'coupon_used' | 'affiliate_joined' | 'user_registered';
    description: string;
    timestamp: string;
    user?: string;
  }>>> {
    const response = await axiosClient.get<ApiResponse<Array<{
      id: string;
      type: 'coupon_used' | 'affiliate_joined' | 'user_registered';
      description: string;
      timestamp: string;
      user?: string;
    }>>>('/dashboard/activity');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
