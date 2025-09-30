import { Coupon } from "@/types";
import { ApiResponse } from "./config";
import axiosClient from "./axiosClient";

class CouponsService {
  // GET /coupons - Listar cupons
  async getCoupons(): Promise<ApiResponse<Coupon[]>> {
    const response = await axiosClient.get<ApiResponse<Coupon[]>>('/coupons');
    return response.data;
  }

  // GET /coupons/:id - Buscar cupom por ID
  async getCouponById(id: string): Promise<ApiResponse<Coupon>> {
    const response = await axiosClient.get<ApiResponse<Coupon>>(`/coupons/${id}`);
    return response.data;
  }

  // GET /coupons/validate/:code - Validar cupom por código
  async validateCoupon(code: string): Promise<ApiResponse<{ valid: boolean; coupon?: Coupon; reason?: string }>> {
    const response = await axiosClient.get<ApiResponse<{ valid: boolean; coupon?: Coupon; reason?: string }>>(`/coupons/validate/${code}`);
    return response.data;
  }

  // POST /coupons - Criar novo cupom
  async createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Coupon>> {
    const response = await axiosClient.post<ApiResponse<Coupon>>('/coupons', couponData);
    return response.data;
  }

  // PUT /coupons/:id - Atualizar cupom
  async updateCoupon(id: string, couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
    const response = await axiosClient.patch<ApiResponse<Coupon>>(`/coupons/${id}`, couponData);
    return response.data;
  }

  // DELETE /coupons/:id - Deletar cupom
  async deleteCoupon(id: string): Promise<ApiResponse<void>> {
    const response = await axiosClient.delete<ApiResponse<void>>(`/coupons/${id}`);
    return response.data;
  }

  // POST /coupons/:id/use - Usar cupom (incrementar contador)
  async useCoupon(id: string, userId?: string): Promise<ApiResponse<Coupon>> {
    const response = await axiosClient.post<ApiResponse<Coupon>>(`/coupons/${id}/use`, { userId });
    return response.data;
  }

  // GET /coupons/stats - Estatísticas dos cupons
  async getCouponsStats(): Promise<ApiResponse<{
    totalCoupons: number;
    activeCoupons: number;
    totalUsage: number;
    topUsedCoupons: Coupon[];
  }>> {
    const response = await axiosClient.get<ApiResponse<{
      totalCoupons: number;
      activeCoupons: number;
      totalUsage: number;
      topUsedCoupons: Coupon[];
    }>>('/coupons/stats');
    return response.data;
  }
}

export const couponsService = new CouponsService();
