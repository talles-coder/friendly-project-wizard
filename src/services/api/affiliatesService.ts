import { Affiliate } from "@/types";
import { ApiResponse } from "./config";
import axiosClient from "./axiosClient";

class AffiliatesService {
  // GET /affiliates - Listar afiliados
  async getAffiliates(): Promise<ApiResponse<Affiliate[]>> {
    const response = await axiosClient.get<ApiResponse<Affiliate[]>>('/affiliates');
    return response.data;
  }

  // GET /affiliates/:id - Buscar afiliado por ID
  async getAffiliateById(id: string): Promise<ApiResponse<Affiliate>> {
    const response = await axiosClient.get<ApiResponse<Affiliate>>(`/affiliates/${id}`);
    return response.data;
  }

  // GET /affiliates/code/:code - Buscar afiliado por código interno
  async getAffiliateByCode(code: string): Promise<ApiResponse<Affiliate>> {
    const response = await axiosClient.get<ApiResponse<Affiliate>>(`/affiliates/code/${code}`);
    return response.data;
  }

  // POST /affiliates - Criar novo afiliado
  async createAffiliate(affiliateData: Omit<Affiliate, 'id' | 'internalCode'>): Promise<ApiResponse<Affiliate>> {
    const response = await axiosClient.post<ApiResponse<Affiliate>>('/affiliates', affiliateData);
    return response.data;
  }

  // PUT /affiliates/:id - Atualizar afiliado
  async updateAffiliate(id: string, affiliateData: Partial<Affiliate>): Promise<ApiResponse<Affiliate>> {
    const response = await axiosClient.patch<ApiResponse<Affiliate>>(`/affiliates/${id}`, affiliateData);
    return response.data;
  }

  // DELETE /affiliates/:id - Deletar afiliado
  async deleteAffiliate(id: string): Promise<ApiResponse<void>> {
    const response = await axiosClient.delete<ApiResponse<void>>(`/affiliates/${id}`);
    return response.data;
  }

  // GET /affiliates/search?q=term - Pesquisar afiliados
  async searchAffiliates(searchTerm: string): Promise<ApiResponse<Affiliate[]>> {
    const response = await axiosClient.get<ApiResponse<Affiliate[]>>(`/affiliates/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }

  // GET /affiliates/:id/stats - Estatísticas do afiliado
  async getAffiliateStats(id: string): Promise<ApiResponse<{
    totalCommissions: number;
    totalSales: number;
    conversionRate: number;
    lastSale: string | null;
  }>> {
    const response = await axiosClient.get<ApiResponse<{
      totalCommissions: number;
      totalSales: number;
      conversionRate: number;
      lastSale: string | null;
    }>>(`/affiliates/${id}/stats`);
    return response.data;
  }
}

export const affiliatesService = new AffiliatesService();
