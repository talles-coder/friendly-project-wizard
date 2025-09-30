import { ApiResponse } from "./config";
import axiosClient from "./axiosClient";

export interface ChildCoupon {
  id: string;
  coupon: string; // UUID do cupom pai
  affiliate: string; // UUID do afiliado
  couponCode: string;
  createdAt?: string;
  updatedAt?: string;
}

class ChildCouponsService {
  // GET /child-coupons - Listar cupons filhos
  async getChildCoupons(): Promise<ApiResponse<ChildCoupon[]>> {
    const response = await axiosClient.get<ApiResponse<ChildCoupon[]>>('/child-coupons');
    return response.data;
  }

  // GET /child-coupons/:id - Buscar cupom filho por ID
  async getChildCouponById(id: string): Promise<ApiResponse<ChildCoupon>> {
    const response = await axiosClient.get<ApiResponse<ChildCoupon>>(`/child-coupons/${id}`);
    return response.data;
  }

  // POST /child-coupons - Criar novo cupom filho
  async createChildCoupon(childCouponData: Omit<ChildCoupon, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ChildCoupon>> {
    const response = await axiosClient.post<ApiResponse<ChildCoupon>>('/child-coupons', childCouponData);
    return response.data;
  }

  // PATCH /child-coupons/:id - Atualizar cupom filho
  async updateChildCoupon(id: string, childCouponData: Partial<ChildCoupon>): Promise<ApiResponse<ChildCoupon>> {
    const response = await axiosClient.patch<ApiResponse<ChildCoupon>>(`/child-coupons/${id}`, childCouponData);
    return response.data;
  }

  // DELETE /child-coupons/:id - Deletar cupom filho
  async deleteChildCoupon(id: string): Promise<ApiResponse<void>> {
    const response = await axiosClient.delete<ApiResponse<void>>(`/child-coupons/${id}`);
    return response.data;
  }
}

export const childCouponsService = new ChildCouponsService();
